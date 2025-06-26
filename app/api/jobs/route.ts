import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(request: NextRequest) {
    const { jobTitle, content } = await request.json()
    console.log(jobTitle, content)
    return NextResponse.json({ message: 'Job created successfully' })
}

export async function GET(request: NextRequest) {
    const jobs = await prisma.jobRequirement.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            jobTitle: true,
        }
    })
    return NextResponse.json(jobs)
}