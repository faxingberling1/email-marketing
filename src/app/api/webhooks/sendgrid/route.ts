import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
    try {
        const events = await req.json()

        // SendGrid sends an array of events
        for (const event of events) {
            const { email, event: eventType, campaign_id } = event

            console.log(`Email Event: ${eventType} for ${email} in campaign ${campaign_id}`)

            // Update database logically (e.g. increment engagement score)
            if (eventType === 'click' || eventType === 'open') {
                await prisma.contact.update({
                    where: { email_userId: { email, userId: 'mock-user-123' } }, // Simple mock logic
                    data: { engagementScore: { increment: 1 } }
                })
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}
