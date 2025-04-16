import Router from "koa-router";
import OpenAI from "openai";
import env from "dotenv";
import { STATUS_CODE } from "../constant/status-code";
import { ChatCompletionMessageParam } from "openai/resources/chat";

type Role = "developer" | "system" | "user" | "assistant" | "tool";

env.config();

const router = new Router();
router.prefix("/deepseek");

router.post("/", async function (ctx, next) {
  const { question } = JSON.parse(ctx.request.body ?? "{}");
  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  ctx.respond = false;
  const stream = await getDeepSeekResponse(question as string);
  let responseMsg = "";
  ctx.res.statusCode = STATUS_CODE.SUCCESS;
  for await (const chunk of stream) {
    const { content, role } = chunk.choices[0]?.delta;
    ctx.res.write(content);
    responseMsg += content;
  }
  historyMsg.push({ content: responseMsg, role: "assistant" });
  ctx.res.end();
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
  });

  return stream;
}

export default router;
