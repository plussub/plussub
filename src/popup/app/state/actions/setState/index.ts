import {AppState} from "@/app/state/types";
import {UnwrapRef} from "vue";

export const setState = ({state}: Pick<UnwrapRef<AppState>, 'state'>): void => {
  window.plusSub_app.value.state = state;
}
