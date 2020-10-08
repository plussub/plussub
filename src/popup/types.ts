export const isHTMLElement = (node: Node | undefined | null): node is HTMLElement => node !== undefined && node !== null && node.nodeType === Node.ELEMENT_NODE;
export const isHTMLVideoElement = (element: Node | undefined | null): element is HTMLVideoElement => isHTMLElement(element) && (element as HTMLElement).tagName.toLowerCase() === 'video';
