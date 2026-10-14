// // send email with nodemailer

// import nodemailer from "nodemailer";
// import { envVars } from "../config/env";
// import AppError from "../errorHelpers/AppError";
// import path from "path";
// import ejs from "ejs";

// const transporter = nodemailer.createTransport({
//   host: envVars.EMAIL_SENDER.SMTP_HOST,
//   port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
//   secure: false,
//   auth: {
//     user: envVars.EMAIL_SENDER.SMTP_USER,
//     pass: envVars.EMAIL_SENDER.SMTP_PASS,
//   },
// });

// interface SendEmailOptions {
//   to: string;
//   from?: string;
//   subject: string;
//   templateName: string;
//   temPlateData: Record<string, unknown>;
//   attachments?: {
//     filename: string;
//     content: Buffer | string;
//     contentType: string;
//   }[];
// }

// export const sendEmail = async ({
//   subject,
//   temPlateData,
//   templateName,
//   to,
//   attachments,
// }: SendEmailOptions) => {
//   try {
//     const templatePath = path.resolve(
//       process.cwd(),
//       `src/app/template/${templateName}.ejs`,
//     );
//     const html = await ejs.renderFile(templatePath, temPlateData);

//     const info = await transporter.sendMail({
//       from: envVars.EMAIL_SENDER.SMTP_FROM,
//       to: to,
//       subject: subject,
//       html: html,
//       attachments: attachments?.map((attachment) => ({
//         filename: attachment.filename,
//         content: attachment.content,
//         contentType: attachment.contentType,
//       })),
//     });

//     console.log("email in sending ", info);
//   } catch (error) {
//     console.log("Sending email successfully", error.message);
//     throw new AppError(404, "Internal server error");
//   }
// };

import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, unknown>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

const smtpPort = Number(envVars.EMAIL_SENDER.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: SendEmailOptions): Promise<void> => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      "src/app/template",
      `${templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log("Email sent successfully:", info.messageId);
  } catch (error: unknown) {
    console.error("Email sending failed:", error);

    throw new AppError(500, "Failed to send email");
  }
};
