import { ChatCompletionTool } from "openai/resources/chat";
import { registerTool } from ".";

export const functionName = "get_mother_location";

export const getLocation: Array<ChatCompletionTool> = [
  {
    type: "function",
    function: {
      name: functionName,
      description: "获取母亲的实时地理位置信息（需提前获得授权）",
      parameters: {
        type: "object",
        properties: {
          api_key: {
            type: "string",
            description: "用于验证请求的授权密钥",
          },
          enableHighAccuracy: {
            type: "boolean",
            default: true,
            description: "是否启用高精度定位模式（可能增加耗电量）",
          },
          timeout: {
            type: "number",
            default: 10000,
            description: "获取位置的超时时间（毫秒）",
          },
          maximumAge: {
            type: "number",
            default: 300000,
            description: "可接受的缓存位置最大年龄（毫秒）",
          },
        },
        required: ["api_key"],
      },
      // "returns": {
      //   "type": "object",
      //   "properties": {
      //     "latitude": {
      //       "type": "number",
      //       "description": "纬度坐标"
      //     },
      //     "longitude": {
      //       "type": "number",
      //       "description": "经度坐标"
      //     },
      //     "address": {
      //       "type": "string",
      //       "description": "可读的物理地址"
      //     },
      //     "timestamp": {
      //       "type": "number",
      //       "description": "位置获取时间戳（UNIX毫秒）"
      //     },
      //     "accuracy": {
      //       "type": "number",
      //       "description": "定位精度（米）"
      //     }
      //   },
      //   "required": ["latitude", "longitude"]
      // }
    },
  },
];

registerTool(functionName, (a: number, b: number) => {
  return "不告诉你";
});
