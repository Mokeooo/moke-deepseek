import Router from "koa-router";
import OpenAI from "openai";
import env from "dotenv";
import { STATUS_CODE } from "../constant/status-code";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { baseDao } from "../modules/base-dao";
import { getWeather } from "../function-calling/get-weather";
import { toolsMap } from "../function-calling/index";
import { getLocation } from "../function-calling/calculator";
type Role = "developer" | "system" | "user" | "assistant" | "tool";

env.config();

const router = new Router();

const DpQuestion = baseDao.getTableModel("DeepseekQuestions");

router.prefix("/deepseek");

router.post("/", async function (ctx, next) {
  const { question } = JSON.parse(ctx.request.body ?? "{}");
  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  await DpQuestion?.create({
    question,
    role: "user",
    content: "",
  });
  ctx.respond = false;
  const stream = await getDeepSeekResponse(question as string);
  let responseMsg = "";
  ctx.res.statusCode = STATUS_CODE.SUCCESS;
  for await (const chunk of stream) {
    const { content, role, tool_calls: tools } = chunk.choices[0]?.delta;
    if (content) {
      ctx.res.write(content);
      responseMsg += content;
    } else if (tools?.length) {
      const functions = tools.map((v) => {
        if (v.type === "function") {
          return {
            name: v.function?.name,
            arguments: v.function?.arguments,
          };
        }
      });
      const cbMsg = functions
        .map((v) => {
          if (!toolsMap.has(v?.name || "")) {
            return "";
          } else {
            const cb = toolsMap.get(v!.name!);
            const res = cb?.call(null, arguments);
            return res;
          }
        })
        .join("");
      responseMsg += cbMsg;
      ctx.res.write(cbMsg);
    }
  }
  historyMsg.push({ content: responseMsg, role: "assistant" });
  await DpQuestion?.create({
    question,
    role: "assistant",
    content: responseMsg,
  });
  ctx.res.end();
});

router.get("/getHistory", async (ctx) => {
  ctx.set({
    "Cache-Control": "no-cache",
  });
  ctx.res.statusCode = STATUS_CODE.SUCCESS;
  const data = await DpQuestion?.findAll();

  ctx.body = {
    data,
  };
  return ctx;
});

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_KEY,
});
const historyMsg: Array<ChatCompletionMessageParam> = [];
async function getDeepSeekResponse(msg: string) {
  const sendMsg: ChatCompletionMessageParam = { role: "user", content: msg };
  historyMsg.push(sendMsg);

  const stream = await openai.chat.completions.create({
    messages: historyMsg,
    model: "deepseek-chat",
    stream: true,
    temperature: 0.2,
    tools: [...getWeather, ...getLocation],
  });
  return stream;
}

export default router;
