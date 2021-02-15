export interface MessageEventFromPopup<T extends string> extends MessageEvent<{ plusSubActionFromPopup: T }> {
  data: {
    plusSubActionFromPopup: T,
    [k: string]: unknown;
  }
}
