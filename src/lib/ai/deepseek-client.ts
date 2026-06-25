import OpenAI from "openai";

export function createDeepSeekClient() {
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    timeout: 60_000,
  });
}

export function assertDeepSeekApiKey() {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("缺少服务端环境变量 DEEPSEEK_API_KEY。");
  }
}
