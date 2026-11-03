import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/generate-questions', async (req, res) => {
    try {
      const { topic = 'General Knowledge & Science', count = 6 } = req.body || {};
      const safeCount = Math.min(Math.max(Number(count) || 6, 3), 15);

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error: 'GEMINI_API_KEY is not configured. Please check Settings > Secrets in AI Studio.',
        });
      }

      const prompt = `Generate ${safeCount} multiple-choice quiz questions for a "Who Wants to Be a Millionaire" 2-Team battle game on the topic: "${topic}".
Distribute the questions evenly across 3 difficulty tiers:
- tier 1: Easy (Levels 1-5)
- tier 2: Medium (Levels 6-10)
- tier 3: Hard / Expert (Levels 11-15)

Every question MUST provide both Arabic (ar) and English (en) translations, with exactly 4 distinct options in each language and the same correctIndex (0, 1, 2, or 3).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an expert quiz master for both Arabic and English editions of Who Wants to Be a Millionaire (من سيربح المليون). Always return factually accurate, unambiguous, secular 4-option trivia questions focusing on science, geography, sports, arts, and general knowledge. Do NOT include religious or Islamic/Muslim questions.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tier: {
                  type: Type.INTEGER,
                  description: 'Difficulty tier: 1 (Easy), 2 (Medium), or 3 (Hard)',
                },
                categoryAr: {
                  type: Type.STRING,
                  description: 'Short category name in Arabic',
                },
                categoryEn: {
                  type: Type.STRING,
                  description: 'Short category name in English',
                },
                questionAr: {
                  type: Type.STRING,
                  description: 'The question text in Arabic',
                },
                questionEn: {
                  type: Type.STRING,
                  description: 'The question text in English',
                },
                optionsAr: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Exactly 4 answer options in Arabic',
                },
                optionsEn: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Exactly 4 answer options in English in the exact same order as optionsAr',
                },
                correctIndex: {
                  type: Type.INTEGER,
                  description: 'Index of the correct option (0, 1, 2, or 3)',
                },
              },
              required: [
                'tier',
                'categoryAr',
                'categoryEn',
                'questionAr',
                'questionEn',
                'optionsAr',
                'optionsEn',
                'correctIndex',
              ],
            },
          },
        },
      });

      const rawText = (response.text ?? '[]').trim();
      const parsed = JSON.parse(rawText);
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid question array returned from model.');
      }

      const formatted = parsed
        .filter(
          (q: any) =>
            Array.isArray(q.optionsAr) &&
            q.optionsAr.length === 4 &&
            Array.isArray(q.optionsEn) &&
            q.optionsEn.length === 4 &&
            typeof q.correctIndex === 'number' &&
            q.correctIndex >= 0 &&
            q.correctIndex <= 3
        )
        .map((q: any, idx: number) => ({
          id: `ai_${Date.now()}_${idx}`,
          tier: (q.tier === 1 || q.tier === 2 || q.tier === 3 ? q.tier : (idx % 3) + 1) as 1 | 2 | 3,
          correctIndex: q.correctIndex,
          ar: {
            question: String(q.questionAr),
            options: q.optionsAr.map(String) as [string, string, string, string],
            category: String(q.categoryAr || topic),
          },
          en: {
            question: String(q.questionEn),
            options: q.optionsEn.map(String) as [string, string, string, string],
            category: String(q.categoryEn || topic),
          },
          isCustom: true,
        }));

      return res.json({ questions: formatted });
    } catch (error: any) {
      console.error('Gemini question generation error:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to generate questions via Gemini API.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
