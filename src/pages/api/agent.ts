import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { createWorker } from 'tesseract.js';
import { OpenAI } from 'openai';
export const config = { api: { bodyParser: false } };
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
async function ocr(file: formidable.File) {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(file.filepath);
  await worker.terminate();
  return text;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const form = new formidable.IncomingForm({ keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ result: 'Parsing form error' });
    let input = fields.input as string;
    const task = fields.task as string;
    const language = (fields.language as string) || 'python';
    if (files.image) {
      const img = Array.isArray(files.image) ? files.image[0] : files.image;
      const text = await ocr(img);
      input += `

OCR:
${text}`;
    }
    const prompt = `You are a senior developer and visual logic agent. Given the following input:

${input}

Please return ${
      task === 'flowchart'
        ? 'a mermaid.js flowchart in plain code format only'
        : task === 'pseudocode'
        ? 'a structured pseudocode summary'
        : `real, working code in ${language}`
    }. Only return the result.`;
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      });
      const output = completion.choices[0]?.message?.content || 'No result.';
      res.status(200).json({ result: output.trim() });
    } catch {
      res.status(500).json({ result: 'Something went wrong. You are safe. Please try again.' });
    }
  });
}
