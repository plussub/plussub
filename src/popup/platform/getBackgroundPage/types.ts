export interface PlussubBackgroundWindowProps {
  parse: () => void
}

export type GetBackgroundPageResult = Window & PlussubBackgroundWindowProps
export type getBackgroundPage = () => Promise<GetBackgroundPageResult>
