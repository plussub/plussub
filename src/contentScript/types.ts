export const EXTENSION_ORIGIN = "plussub" as const;
export const EXTENSION_LABEL = "+Sub" as const;

export const isGenericContentScriptInputMessageEvent = <T extends string, P extends Record<string, unknown> > (m: MessageEvent): m is ContentScriptInputMessageEvent<T, P> => {
  return m.data.extensionOrigin === EXTENSION_ORIGIN && typeof m.data.contentScriptInput === 'string';
}

export interface ContentScriptInputMessageEvent<T extends string, P extends Record<string, unknown>> extends MessageEvent<{ contentScriptInput: T, extensionOrigin: typeof EXTENSION_ORIGIN} & P> {
  data: {
    extensionOrigin: typeof EXTENSION_ORIGIN,
    contentScriptInput: T,
  } & P
}

export type GenericContentScriptInputMessageEvent = ContentScriptInputMessageEvent<string, Record<string, unknown>>;
