export interface PlussubBackgroundWindowProps {
  plussub: {
    parse: () => void
  }
}

export type GetBackgroundPageResult = Window & PlussubBackgroundWindowProps
export type getBackgroundPage = () => Promise<GetBackgroundPageResult>
