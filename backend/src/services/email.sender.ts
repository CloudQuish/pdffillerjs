import {
  MailerSend,
  EmailParams,
  Sender,
  Recipient,
  Attachment,
} from "mailersend";
import { Variable } from "mailersend/lib/modules/Email.module";

const sendEmail = async ({
  sendFromName = process.env.MAILER_SEND_FROM_NAME,
  sendFromEmail = process.env.MAILER_SEND_FROM_EMAIL,
  template_id,
  to,
  subject,
  variables,
  replyTo,
  attachments,
}: {
  sendFromEmail?: string;
  sendFromName?: string;
  replyTo?: string;
  template_id: string;
  to: string;
  subject: string;
  variables: Variable[];
  attachments?: Attachment[];
}) => {
  try {
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILER_SEND_API_KEY,
    });

    const sentFrom = new Sender(sendFromEmail, sendFromName);

    const recipients = [new Recipient(to)];
    const replyToEmail = replyTo ? new Sender(replyTo) : sentFrom;
    let emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(replyToEmail)
      .setSubject(subject)
      .setVariables(variables)
      .setTemplateId(template_id);

    if (attachments) {
      emailParams = emailParams.setAttachments(attachments);
    }

    await mailerSend.email.send(emailParams);

    return true;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

export default {
  sendEmail,
};
