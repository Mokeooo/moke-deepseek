import { ChatCompletionTool } from "openai/resources/chat";
import { registerTool } from ".";

export const functionName = "get_weather";

export const getWeather: Array<ChatCompletionTool> = [
  {
    type: "function",
    function: {
      name: functionName,
      description:
        "Get weather of an location, the user shoud supply a location first",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
        },
        required: ["location"],
      },
    },
  },
];

registerTool(functionName, () => {
  return 6666;
});
