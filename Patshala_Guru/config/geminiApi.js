import { prompt } from '@/constants/Prompts';

const cleanGeminiResponse = (text) => {
  return text
    .replace(/```json\n?/, '')
    .replace(/```/, '')
    .replace(/^\s*\[/, '')
    .replace(/\]\s*$/, '')
    .trim();
};

export const generateCourseOutline = async (courseName, apiKey) => {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const fullPrompt = `${prompt.IDEA}\nTopic: "${courseName}"`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: fullPrompt
          }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 8192, // Increase token limit
      temperature: 0.7,
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API raw response:', JSON.stringify(data, null, 2));

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.text ||
      '';

    if (!rawText.trim()) {
      throw new Error("Empty or missing text in Gemini response");
    }

    const cleanedText = cleanGeminiResponse(rawText);
    return cleanedText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
