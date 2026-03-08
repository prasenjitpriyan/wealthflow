import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    if (!genAI) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a financial category assistant. Suggest the most appropriate icon (emoji), color (hex code), and transaction type for the given financial category name.

Output ONLY a valid JSON object with no explanation or markdown.

Rules:
- "icon": must be exactly one of: 📁 🍔 🚗 🏠 💊 ✈️ 🎮 👗 📚 💼 💰 🏋️ 🎵 🐾 🌱 🚬
- "color": must be exactly one of: #6366f1 #10b981 #f59e0b #ef4444 #3b82f6 #8b5cf6 #ec4899 #06b6d4
- "type": must be exactly one of: EXPENSE INCOME TRANSFER

Category name: "${name}"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text
      .replace(/^```json?\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

    let suggestion: { icon?: string; color?: string; type?: string };
    try {
      suggestion = JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse Gemini JSON', e, cleaned);
      throw new Error('Failed to parse AI output');
    }

    return NextResponse.json(suggestion);
  } catch (error) {
    console.error('AI Category Suggestion API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
}
