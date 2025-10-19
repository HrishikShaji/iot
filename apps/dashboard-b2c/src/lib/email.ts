// lib/email.ts
import nodemailer from 'nodemailer';
import { NEXT_PUBLIC_APP_URL, NODE_ENV, SMTP_HOST, SMTP_PASS, SMTP_USER } from './variables';

const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: NODE_ENV === "development" ? 587 : 465,
	secure: false,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS,
	},
});

export async function sendInvitationEmail(
	to: string,
	token: string,
	inviterEmail: string
) {
	const invitationUrl = `${NEXT_PUBLIC_APP_URL}/signup?token=${token}`;

	await transporter.sendMail({
		from: SMTP_USER,
		to,
		subject: 'You have been invited to access a trailer',
		html: `
      <h2>Trailer Access Invitation</h2>
      <p>${inviterEmail} has invited you to access their trailer.</p>
      <p>Click the link below to create your account and get access:</p>
      <a href="${invitationUrl}">${invitationUrl}</a>
      <p>This invitation will expire in 7 days.</p>
    `,
	});
}
