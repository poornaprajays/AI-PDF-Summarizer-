require('dotenv').config();

const summarizePDF = async (extractedText) => {
  const prompt = `
    You are an expert document summarizer.
    Given the following PDF content, do three things:
    1. Write a clear and concise summary in simple language (max 200 words).
    2. List 5 key points as bullet points.
    3. Suggest 3 follow-up questions a reader might ask.

    PDF Content:
    ${extractedText}

    Respond in this exact JSON format:
    {
      "summary": "...",
      "keyPoints": ["...", "...", "...", "...", "..."],
      "followUpQuestions": ["...", "...", "..."]
    }
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text;

  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return parsed;
};

const answerQuestion = async (extractedText, question) => {
  const prompt = `
    You are a helpful assistant. A user has uploaded a PDF document and is asking a question about it.

    PDF Content:
    ${extractedText}

    User Question:
    ${question}

    Answer clearly and concisely based only on the PDF content. If the answer is not in the document, say so honestly.
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 512
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
};

module.exports = { summarizePDF, answerQuestion };
