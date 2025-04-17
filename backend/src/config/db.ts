interface DbConf {
  host: string;
  user: string;
  password: string;
  port: number;
  database: string;
}

interface EnvConf {
  dev: DbConf;
  prod: DbConf;
}

class Conf {
  static conf: Conf = new Conf();
  env!: keyof EnvConf;
  envConf!: EnvConf;
  constructor() {
    this.env = process.env.NODE_ENV === "prod" ? "prod" : "dev";
    this.initConf();
  }
  // 初始化配置
  initConf() {
    this.envConf = {
      dev: {
        host: "localhost",
        user: "root",
        password: "123456",
        port: 3306,
        database: "mk-deepseek",
      },
      prod: {
        host: "www.xxx.com",
        user: "root",
        password: "123456",
        port: 3306,
        database: "mk-deepseek",
      },
    };
  }
  // 函数重载实现获取 db 连接配置
  getConf(): DbConf;
  getConf(key: string): DbConf;
  getConf(key: any = "") {
    if (this.isDbConfKeys(key) && key.length > 0) {
      return this.envConf[this.env][key];
    } else {
      return this.envConf[this.env];
    }
  }
  // 判断是不是符合要求的类型
  isDbConfKeys(key: any): key is keyof DbConf {
    return ["host", "user", "password", "database", "port"].includes(key);
  }
}

export default Conf.conf;
