import {trackMutation, Payload} from "./trackMutation";


export interface TrackStore {
  actions: {
    track: (payload: Payload) => Promise<unknown> ;
  };
}

export const init = (): TrackStore => {
  return {
    actions: {
      track: (payload: Payload): Promise<unknown> => trackMutation(payload)
    }
  };
};
