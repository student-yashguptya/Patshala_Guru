// Updated Prompts.js with better JSON structure requirements
import dedent from 'dedent';

export const prompt = {
  IDEA: dedent`
    As you are a coaching teacher  
    - User wants to learn about the topic  
    - Generate 5–7 course titles for study (short)  
    - Make sure it is related to the description  
    - Output will be an ARRAY of Strings in JSON FORMAT only  
    - Do not add any plain text in output.
    - Ensure the JSON is complete and valid
    - Example output format: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
  `,

  COURSE: dedent`
    As you are a coaching teacher, create a complete and valid JSON response.
    
    IMPORTANT: Your response must be ONLY valid JSON - no extra text before or after.
    
    Requirements:
    - User wants to learn about all topics  
    - Create 1-2 Courses (not 5, to avoid truncation) with Course Name, Description, Difficulty Level (Easy, Moderate, Advanced), Category, and 1-2 Chapters per course  
    - Categories must be one of: ["Tech & Coding", "Business & Finance", "Health & Fitness", "Science & Engineering", "Arts & Creativity"]  
    - Add a Course Banner Image randomly from: ["/banner1.png", "/banner2.png", "/banner3.png", "/banner4.png", "/banner5.png", "/banner6.png"]  
    - Each chapter should include 2-3 topics (not 2-4, to keep response shorter) with:  
        - "topic": A short title (2–4 words)  
        - "explain": Detailed explanation (3-5 lines, not 5-8, to keep shorter)  
        - "code": Code example if relevant, else null  
        - "example": Real-life or theoretical example if relevant, else null  
    - Explain content in a friendly and tutorial style  
    - Generate the following per course:  
        - 2 Quiz questions (not 10, to keep shorter) with 1 question, 4 options, and correct answer  
        - 2 Flashcards (not 5, to keep shorter) with front and back  
        - 2 Q&A pairs (not 5, to keep shorter) with question and answer  
    
    Output ONLY this JSON structure with no additional text:
    
    {
      "courses": [
        {
          "courseTitle": "string",
          "description": "string",
          "difficulty": "Easy|Moderate|Advanced",
          "category": "Tech & Coding",
          "banner_image": "/banner1.png",
          "chapters": [
            {
              "chapterName": "string",
              "content": [
                {
                  "topic": "2-4 word title",
                  "explain": "3-5 line explanation",
                  "code": "code snippet or null",
                  "example": "example or null"
                }
              ]
            }
          ],
          "quiz": [
            {
              "question": "string",
              "options": ["option1", "option2", "option3", "option4"],
              "correctAns": "option1"
            }
          ],
          "flashcards": [
            {
              "front": "string",
              "back": "string"
            }
          ],
          "qa": [
            {
              "question": "string",
              "answer": "string"
            }
          ]
        }
      ]
    }
  `
};