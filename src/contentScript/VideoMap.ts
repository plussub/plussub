import { nanoid } from 'nanoid';

export interface Video {
  id: string;
  hasSubtitle: boolean;
  el: HTMLVideoElement;
  src: string;
}

const normalizeCurrentSrc = (url: URL) => url.origin + url.pathname + url.search;
const isValidVideo = (el: HTMLVideoElement): boolean => el.offsetWidth !== 0 && el.offsetHeight !== 0 && el.currentSrc !== '';

export class VideoMap {
  idToVideo: Map<string, Video>;
  elementToVideo: Map<HTMLVideoElement, Video>;

  constructor() {
    this.idToVideo = new Map<string, Video>();
    this.elementToVideo = new Map<HTMLVideoElement, Video>();
  }

  getElementFrom(id: string): HTMLVideoElement | null {
    return this.idToVideo.get(id)?.el ?? null;
  }

  addAllAndRemoveWhichAreNotIncluded(elements: HTMLVideoElement[]): { founded: Record<string, { id: string; hasSubtitle: boolean; origin: string }>; removed: string[] } {
    const included: Video[] = elements.filter((el) => this.elementToVideo.has(el)).map((el) => this.elementToVideo.get(el) as Video);

    const includedButWithSameCurrentSrc = included.filter(({ el }) => this.elementToVideo.get(el)!.src === normalizeCurrentSrc(new URL(el.currentSrc)));
    const includedButWithNewCurrentSrc = included.filter(({ el }) => this.elementToVideo.get(el)!.src !== normalizeCurrentSrc(new URL(el.currentSrc)));
    includedButWithNewCurrentSrc.forEach(({ el }) => el.classList.remove('plussub'));
    const changedCurrentSrc = includedButWithNewCurrentSrc.map((video) => ({
      id: nanoid(12),
      el: video.el,
      hasSubtitle: false,
      src: normalizeCurrentSrc(new URL(video.el.currentSrc))
    }));

    const newAdded: Video[] = elements
      .filter(el => isValidVideo(el))
      .filter((el) => !this.elementToVideo.has(el))
      .map((el) => ({
        id: nanoid(12),
        el,
        hasSubtitle: el.classList.contains('plussub'),
        src: normalizeCurrentSrc(new URL(el.currentSrc))
      }));

    const removed = [...[...this.idToVideo.keys()].filter((id) => !included.find((e) => e.id === id)), ...includedButWithNewCurrentSrc.map(({ id }) => id)];

    this.elementToVideo.clear();
    this.idToVideo.clear();

    [...includedButWithSameCurrentSrc, ...changedCurrentSrc, ...newAdded].forEach((entry) => {
      this.elementToVideo.set(entry.el, entry);
      this.idToVideo.set(entry.id, entry);
    });

    return {
      founded: Object.fromEntries(
        [...this.idToVideo.entries()].map(([key, { id, hasSubtitle }]) => [
          key,
          {
            id,
            hasSubtitle,
            origin: window.location.origin
          }
        ])
      ),
      removed
    };
  }
}
