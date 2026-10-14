import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// API route for Ask Gemini
app.post('/api/ask', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Please provide a valid question or study topic.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt.trim(),
        config: {
          systemInstruction:
            'You are a friendly, concise, and highly effective AI Study Assistant. Help students comprehend concepts clearly, provide structured summaries, bullet points, key takeaways, mnemonics, or practice questions when appropriate.',
        },
      });

      const text = response.text || 'No response generated.';
      return res.json({ text, source: 'gemini' });
    }

    // High quality fallback if API key is not configured in environment
    const generatedStudyNotes = generateSmartStudyGuide(prompt.trim());
    return res.json({
      text: generatedStudyNotes,
      source: 'offline-preview',
      note: 'Tip: Add your GEMINI_API_KEY in the Secrets panel to activate direct live Gemini calls.',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    // Provide graceful response instead of failing
    const fallback = generateSmartStudyGuide(req.body?.prompt || 'Study Guide');
    return res.json({
      text: `${fallback}\n\n*(Note: Live API request encountered: ${error?.message || 'Connection error'}. Provided study guide template above.)*`,
      source: 'fallback',
    });
  }
});

function generateSmartStudyGuide(query: string): string {
  const title = query.length > 50 ? query.slice(0, 50) + '...' : query;
  return `### 📖 Quick Study Breakdown: ${title}

#### 1. Core Concept Overview
- **Key Definition**: A foundational understanding of "${query}".
- **Essential Objective**: Break down complex parts into clear, memorable principles for quick mastery.

#### 2. Key Pillars & Fundamentals
1. **Primary Rule**: Identify the fundamental mechanism and why it matters.
2. **Context & Application**: How this concept connects to real-world problems or exam scenarios.
3. **Common Pitfalls**: Watch out for subtle misconceptions, ambiguous terms, or overlapping definitions.

#### 3. Memory Aid (Mnemonic)
> 💡 **Quick Tip**: Connect this concept to an intuitive metaphor or personal story to retain it for long-term recall.

#### 4. Practice Check Questions
- *Question 1*: How would you explain this in your own words to someone without prior background?
- *Question 2*: What is the single most important factor that determines success when applying this concept?`;
}

// Development with Vite middleware or Production static files
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Study Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
