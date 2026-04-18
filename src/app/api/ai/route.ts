import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // ==========================================
    // MVP: SIMULATED AI RESPONSE
    // ==========================================
    // In production, replace this with an actual OpenAI call such as:
    // const response = await openai.chat.completions.create({ ... })
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const simulatedBreakdown = [
      { title: `Read introductory material on ${topic}` },
      { title: `Watch a comprehensive tutorial about ${topic}` },
      { title: `Create summary notes and flashcards for ${topic}` },
      { title: `Complete a practical exercise or quiz on ${topic}` },
    ];

    return NextResponse.json({ tasks: simulatedBreakdown });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
