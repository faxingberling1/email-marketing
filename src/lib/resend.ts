import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
    campaignId: string;
    contactId?: string;
}

function generateEmailFooter(contactId?: string) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const unsubscribeUrl = contactId ? `${baseUrl}/unsubscribe?id=${contactId}` : `${baseUrl}/unsubscribe`;

    return `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-family: sans-serif; color: #64748b; font-size: 11px; line-height: 1.6;">
            <p><strong>MailMind Tactical Operations</strong><br>
            2101 Mission Control Dr, Silicon Valley, CA 94025</p>
            <p>You are receiving this because you signed up for orbital updates. 
            Want to stop receiving signals? <a href="${unsubscribeUrl}" style="color: #6366f1; text-decoration: none; font-weight: bold;">Unsubscribe here</a></p>
            <p>&copy; ${new Date().getFullYear()} MailMind Inc. All rights reserved.</p>
        </div>
    `;
}

export async function sendEmail({ to, from, subject, text, html, campaignId, contactId }: SendEmailParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: from || 'onboarding@resend.dev', // Default verified sender for trial or your verified domain
            to: [to],
            subject: subject,
            text: text + "\n\n---\nMailMind Inc. | 2101 Mission Control Dr, Silicon Valley, CA 94025\nUnsubscribe: " + (contactId ? `${process.env.NEXTAUTH_URL}/unsubscribe?id=${contactId}` : `${process.env.NEXTAUTH_URL}/unsubscribe`),
            html: (html || text.replace(/\n/g, '<br>')) + generateEmailFooter(contactId),
            headers: {
                'X-Campaign-Id': campaignId,
            }
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Unexpected Resend Error:', error);
        throw error;
    }
}
