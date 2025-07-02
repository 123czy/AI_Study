import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { content } = await request.json()
  console.log(content)
  return NextResponse.json({ message: "success" })
}