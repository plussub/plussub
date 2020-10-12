import {UnwrapRef} from "vue";
import {AppState} from "@/app/state/types";

export const setSrc = ({src}: Pick<UnwrapRef<AppState>, 'src'>): void => {
  window.plusSub_app.value.src = src;
}
