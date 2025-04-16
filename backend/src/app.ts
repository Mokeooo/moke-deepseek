import koa from "koa";
import env from "dotenv";
import routerLoader from "./common/router-loader";
import globalException from "./common/global-exception";
const app = new koa();
env.config();
app.use(globalException);
routerLoader.init(app);
