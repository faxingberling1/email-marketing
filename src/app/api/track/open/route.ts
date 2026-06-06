import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 1x1 transparent GIF
const pixel = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eid = searchParams.get('eid'); // email id

        if (eid) {
            // Update open status
            await prisma.email.updateMany({
                where: { id: eid, opened: false },
                data: { opened: true }
            });
            // We use updateMany so it doesn't throw if already opened or deleted
        }

        return new NextResponse(pixel, {
            status: 200,
            headers: {
                'Content-Type': 'image/gif',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('Tracking pixel error:', error);
        // Always return the pixel even if DB update fails
        return new NextResponse(pixel, {
            status: 200,
            headers: {
                'Content-Type': 'image/gif',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    }
}
