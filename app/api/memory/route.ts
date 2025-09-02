// import { getMem0Service } from '@/lib/mem0-service'
import MemoryService from '@/lib/memory'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { content, userId, sessionId, metadata } = await req.json()

    if (!content || !userId) {
      return NextResponse.json(
        { error: 'Content and userId are required' },
        { status: 400 }
      )
    }

    const memoryService = new MemoryService(process.env.MEM0_API_KEY || '')
    const memory = await memoryService.addMemory({
      messages: [{ role: 'user', content }],
      user_id: userId,
      agent_id: '123',
      session_id: sessionId,
      metadata: metadata || {},
    })

    return NextResponse.json({ memory })
  } catch (error) {
    console.error('Error adding memory:', error)
    return NextResponse.json({ error: 'Failed to add memory' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    console.log('searchParams11', searchParams)

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const memoryService = new MemoryService(process.env.MEM0_API_KEY || '')
    const memories = await memoryService.getMemories(userId)

    console.log('memories11', userId, memories)

    return NextResponse.json({ memories })
  } catch (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memories', detail: String(error) },
      { status: 500 }
    )
  }
}

// export async function PUT(req: NextRequest) {
//   try {
//     const { memoryId, content, metadata } = await req.json()

//     if (!memoryId || !content) {
//       return NextResponse.json(
//         { error: 'memoryId and content are required' },
//         { status: 400 }
//       )
//     }

//     const mem0Service = getMem0Service()
//     const memory = await mem0Service.updateMemory(memoryId, content, metadata)

//     return NextResponse.json({ memory })
//   } catch (error) {
//     console.error('Error updating memory:', error)
//     return NextResponse.json(
//       { error: 'Failed to update memory' },
//       { status: 500 }
//     )
//   }
// }

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const clearAll = searchParams.get('clearAll') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const memoryService = new MemoryService(process.env.MEM0_API_KEY || '')

    if (clearAll && userId) {
      await memoryService.deleteMemory(userId, '123')
      return NextResponse.json({ message: 'All memories cleared' })
    } else {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error deleting memory:', error)
    return NextResponse.json(
      { error: 'Failed to delete memory' },
      { status: 500 }
    )
  }
}
