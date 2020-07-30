export interface PlussubBackgroundWindowProps {
  plussub: {
    parse: () => void
    setOffsetTime: ({offsetTime}: { offsetTime: number }) => void
  }
}

export type GetBackgroundPageResult = Window & PlussubBackgroundWindowProps
export type getBackgroundPage = () => Promise<GetBackgroundPageResult>
