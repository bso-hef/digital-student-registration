import FormData from "form-data";
import fs from "fs";
import Handlebars from "handlebars";
import i18n from "i18n";
import Mailgun from "mailgun.js";
import path from "path";

import Logger from "../app/services/Logger/index.js";
import envConstants from "../utils/constants/envConstants.js";

const logger = new Logger("middleware <<<===>>> emailer");

// Create __dirname in an ESM context
const __dirname = path.resolve();

// Register Handlebars helper
Handlebars.registerHelper("i18n", key => i18n.__(key));

const {
  NODE_ENV,
  MAILGUN_API_KEY,
  MAILGUN_URI,
  EMAIL_FROM_ADDRESS,
  EMAIL_FROM_NAME,
  EMAIL_SMTP_DOMAIN_MAILGUN,
} = envConstants;

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: MAILGUN_API_KEY,
  url: MAILGUN_URI || "https://api.mailgun.net",
});

/**
 * Sends email.
 * @param {Object} data - Data containing email details.
 * @param {Function} callback - Callback function to handle success or failure.
 */
export const sendEmail = async (data, callback) => {
  const mailOptions = {
    from: `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`,
    to: data.email,
    subject: data.subject,
    html: data.htmlMessage,
    text: data.text,
    attachment: data.attachment,
    method: data.method,
    categories: data.categories,
  };

  logger.info("Initiating email send.", {
    recipient: data.email,
    subject: data.subject,
  });

  mg.messages
    .create(EMAIL_SMTP_DOMAIN_MAILGUN, mailOptions)
    .then(body => {
      logger.info("Email sent successfully.", {
        recipient: data.email,
        response: body,
      });
      callback(true);
    })
    .catch(error => {
      logger.error("Failed to send email.", {
        recipient: data.email,
        error,
      });
      callback(false);
    });
};

/**
 * Prepares to send email.
 * @param {Object} user - User object.
 * @param {string} subject - Email subject.
 * @param {string} templateFile - Template filename.
 * @param {Object} templateVars - Template variables.
 */
export const prepareToSendEmail = async (
  user,
  subject,
  templateFile,
  templateVars,
) => {
  try {
    const templatePath = path.join(__dirname, "../app/templates", templateFile);
    const templateSource = await fs.promises.readFile(templatePath, "utf8");
    const template = Handlebars.compile(templateSource);
    const htmlMessage = template(templateVars);

    const data = {
      email: user.email,
      subject,
      htmlMessage,
      text: templateVars.plainText || "",
    };

    logger.debug("Prepared email data for sending.", {
      emailData: data,
    });

    sendEmail(data, messageSent =>
      messageSent
        ? logger.info("Email sent successfully to user.", {
            email: user.email,
          })
        : logger.error("Email failed to send to user.", {
            email: user.email,
          }),
    );

    if (NODE_ENV === "development" || NODE_ENV === "local_development") {
      logger.debug("Email data in development:", {
        emailData: data,
      });
    }
  } catch (error) {
    logger.error("Error preparing email for sending.", {
      error,
      user: user.email,
    });
  }
};
