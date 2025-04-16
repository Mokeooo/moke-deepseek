<script setup lang="ts">
import { ref } from "vue";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

const answers = ref<string[]>([]);
const questions = ref<string[]>([]);
const text = ref("");
const streamText = ref("");
const sendQuestion = async (question: string) => {
  if (!question) return;
  questions.value.push(question);
  const response = await fetch(`http://localhost:3002/deepseek`, {
    method: "POST",
    headers: {
      "Content-Type": "text/event-stream",
    },
    body: JSON.stringify({
      question,
    }),
  });
  // 通过 ReadableStream 处理数据流

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      answers.value.push(streamText.value);
      streamText.value = "";
      break;
    }

    const chunk = decoder.decode(value);
    // console.log(done, chunk);

    // const data = JSON.parse(chunk); // 根据实际数据格式解析
    streamText.value += chunk;
  }
};
const deepseekApi = async () => {
  // const res = await fetch(`http://localhost:3000/users`);
  // console.log(res);
};
const handleSend = () => {
  sendQuestion(text.value);
  text.value = "";
};
</script>

<template>
  <div class="container">
    <el-container class="container">
      <el-aside width="200px">侧边栏</el-aside>
      <el-container>
        <el-main>
          <template v-for="(item, index) of questions" :key="index">
            Q:
            <p v-html="item"></p>
            A:
            <p
              class="markdown-body"
              v-html="md.render(answers[index] ? answers[index] : streamText)"
              v-loading="!answers[index]"
            ></p>
          </template>
        </el-main>
        <el-footer>
          <div class="input-container">
            <div class="left">
              <el-input
                v-model="text"
                type="textarea"
                @keydown.enter="handleSend"
              ></el-input>
            </div>
            <div class="right">
              <el-button type="primary" @click="deepseekApi">发送</el-button>
            </div>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
}
.input-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.left {
  flex: 1;
}
</style>
