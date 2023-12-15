import Axios from "axios";

import { env } from "@/env";

export const mailcoachClient = Axios.create({
  baseURL: "https://reetcode.mailcoach.app/api",
  headers: {
    Authorization: `Bearer ${env.MAILCOACH_API_TOKEN}`,
  },
});

mailcoachClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export enum MailcoachEmails {
  EMAIL_VERIFICATION_LINK = "Email verification link",
}

export async function sendTransactionalEmail(
  name: MailcoachEmails,
  email: string,
  replacements: Record<string, string>,
) {
  return mailcoachClient.post("transactional-mails/send", {
    mail_name: name,
    to: email,
    from: "reetcode@mailcoach.cloud",
    replacements,
  });
}
