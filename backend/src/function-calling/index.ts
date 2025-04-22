export const toolsMap = new Map<string, Function>();

export const registerTool = (name: string, callback: Function) => {
  if (typeof callback !== "function")
    throw new TypeError(`Type error. callback ${callback} is not a function`);
  toolsMap.set(name, callback);
};

