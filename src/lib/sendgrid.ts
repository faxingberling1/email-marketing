import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SendEmailParams {
    to: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
    campaignId: string;
}

export async function sendEmail({ to, from, subject, text, html, campaignId }: SendEmailParams) {
    const msg = {
        to,
        from: from || 'noreply@aem.ai', // Default verified sender
        subject,
        text,
        html: html || text.replace(/\n/g, '<br>'),
        customArgs: {
            campaign_id: campaignId,
        },
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error('SendGrid Error:', error);
        throw error;
    }
}
