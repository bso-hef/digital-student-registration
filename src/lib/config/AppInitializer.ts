import { setApplicationTouched } from "../../store/actions/uiActions";
import { store } from "../../store/store";
import "../config/i18n";

export const trapApplicationTouched = () => {
  document.body.addEventListener("click", () =>
    store.dispatch(setApplicationTouched()),
  );
};
