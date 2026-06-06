import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eid = searchParams.get('eid'); // email id
        const url = searchParams.get('url'); // target url

        if (!url) {
            return new NextResponse('Missing URL parameter', { status: 400 });
        }

        if (eid) {
            // Update click status and open status (since a click implies an open)
            await prisma.email.updateMany({
                where: { id: eid, clicked: false },
                data: { clicked: true, opened: true }
            });
        }

        // Redirect to target URL
        return NextResponse.redirect(url, { status: 302 });
    } catch (error) {
        console.error('Click tracking error:', error);
        // Fallback redirect if something fails, trying to get URL from query
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');
        if (url) {
            return NextResponse.redirect(url, { status: 302 });
        }
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
