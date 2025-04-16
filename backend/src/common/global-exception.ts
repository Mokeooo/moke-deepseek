import type { Context, Next } from "koa";

/**
 * @description: 全局异常处理中间件
 */
const globalException = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    const err = error as Error;
    ctx.body = `服务器错误${err.message}`;
    console.error(error);
  }
};

export default globalException;
