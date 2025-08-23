import envConstants from "../utils/constants/envConstants.js";
import { ROLE } from "../utils/constants/generalConstants.js";

const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = envConstants;

const adminData = {
  userName: ADMIN_USERNAME || "admin",
  email: ADMIN_EMAIL || "admin@mern-template.com",
  password: ADMIN_PASSWORD || "mernTemplate1234!",
  firstName: "Super",
  lastName: "Admin",
  role: ROLE.ADMIN, // Assuming the role is still 'admin'
  isEmailVerified: true,
  profile: {
    birthday: new Date("1980-01-01"), // Provide a valid Date object for birthday
    noAvatarBackground: "#33FFF5", // Use a valid enum value for noAvatarBackground
  },
};

export default adminData;
