import { prompt } from '@/constants/Prompts'; // <-- adjust path if needed

export const generateCourseOutline = async (courseName, apiKey) => {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const fullPrompt = `${prompt.IDEA}\nTopic: "${courseName}"`; // or prompt.COURSE for full content

  const body = {
    contents: [
      {
        parts: [
          {
            text: fullPrompt
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Gemini API raw response:', JSON.stringify(data, null, 2));

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No valid text in Gemini response");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
