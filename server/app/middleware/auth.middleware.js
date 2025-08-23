import passport from "passport";

import "../../config/passport.js";

export const AUTHChecker = passport.authenticate("jwt", {
  session: false,
});
