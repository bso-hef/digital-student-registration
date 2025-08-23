import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import passport from "passport";

import User from "../app/models/User.js";
import Logger from "../app/services/Logger/index.js";
import envConstants from "../utils/constants/envConstants.js";

const logger = new Logger("Config <<==>> Passport");
const { JWT_SECRET } = envConstants;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export default function configurePassport() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        if (!jwt_payload || !jwt_payload.uuid) {
          logger.warn("Invalid JWT payload:", jwt_payload);
          return done(null, false, { message: "Invalid token payload" });
        }

        logger.info("Authenticating user with payload:", jwt_payload);

        const user = await User.findOne({ _id: jwt_payload.uuid });

        if (!user) {
          logger.warn("User not found:", jwt_payload.uuid);
          return done(null, false, { message: "User not found" });
        }

        logger.info("User authenticated successfully:", user?.id);
        return done(null, user);
      } catch (error) {
        logger.error("Error in JWT Strategy:", error.message);
        return done(error, false, { message: "Authentication error" });
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
