import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type Lang = 'cs-CZ' | 'en';

const templates: Record<
    Lang,
    {
        subject: string;
        html: (params: { resetUrl: string }) => string;
        text: (params: { resetUrl: string }) => string;
    }
> = {
    'cs-CZ': {
        subject: 'Reset hesla – Timedo',
        html: ({ resetUrl }) => `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
                <p>Dobrý den,</p>
                <p>někdo požádal o reset hesla k vašemu účtu Timedo. Pokud jste to byli vy, nastavte si nové heslo kliknutím na tlačítko níže:</p>
                <p style="text-align: center; margin: 32px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                        Nastavit nové heslo
                    </a>
                </p>
                <p style="font-size: 13px; color: #666;">
                    Pokud tlačítko nefunguje, zkopírujte tento odkaz do prohlížeče:<br />
                    <a href="${resetUrl}" style="color: #4f46e5;">${resetUrl}</a>
                </p>
                <p style="font-size: 13px; color: #666;">
                    Odkaz je platný 15 minut. Pokud jste o reset hesla nežádali, tento e-mail můžete ignorovat – vaše heslo zůstane beze změny.
                </p>
            </div>
        `,
        text: ({ resetUrl }) =>
            `Dobrý den,\n\nněkdo požádal o reset hesla k vašemu účtu Timedo. Pokud jste to byli vy, nastavte si nové heslo na tomto odkazu:\n${resetUrl}\n\nOdkaz je platný 15 minut. Pokud jste o reset hesla nežádali, tento e-mail můžete ignorovat.`,
    },
    en: {
        subject: 'Reset your password – Timedo',
        html: ({ resetUrl }) => `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
                <p>Hi,</p>
                <p>Someone requested a password reset for your Timedo account. If this was you, set a new password by clicking the button below:</p>
                <p style="text-align: center; margin: 32px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                        Set new password
                    </a>
                </p>
                <p style="font-size: 13px; color: #666;">
                    If the button doesn't work, copy this link into your browser:<br />
                    <a href="${resetUrl}" style="color: #4f46e5;">${resetUrl}</a>
                </p>
                <p style="font-size: 13px; color: #666;">
                    This link is valid for 15 minutes. If you didn't request a password reset, you can safely ignore this e-mail – your password will remain unchanged.
                </p>
            </div>
        `,
        text: ({ resetUrl }) =>
            `Hi,\n\nSomeone requested a password reset for your Timedo account. If this was you, set a new password using this link:\n${resetUrl}\n\nThis link is valid for 15 minutes. If you didn't request a password reset, you can safely ignore this e-mail.`,
    },
};

export const sendPasswordResetEmail = async (
    to: string,
    resetUrl: string,
    lang: string
) => {
    const template = templates[lang as Lang] ?? templates['cs-CZ'];

    await resend.emails.send({
        from: 'passwordreset@timedo.cz',
        to,
        subject: template.subject,
        html: template.html({ resetUrl }),
        text: template.text({ resetUrl }),
    });
};
