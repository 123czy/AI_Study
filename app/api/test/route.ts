import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'API 路由正常工作' })
}

export async function POST(request: NextRequest) {
    return NextResponse.json({ message: 'POST 请求正常工作' })
} 