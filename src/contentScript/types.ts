export interface ContentScriptInputMessageEvent<T extends string> extends MessageEvent<{ plusSubContentScriptInput: T }> {
  data: {
    plusSubContentScriptInput: T,
    [k: string]: unknown;
  }
}
