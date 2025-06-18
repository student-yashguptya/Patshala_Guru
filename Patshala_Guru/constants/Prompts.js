import dedent from 'dedent';

export const prompt = {
  IDEA: dedent`
    As you are a coaching teacher  
    - User wants to learn about the topic  
    - Generate 5–7 course titles for study (short)  
    - Make sure it is related to the description  
    - Output will be an ARRAY of Strings in JSON FORMAT only  
    - Do not add any plain text in output.
  `,

  COURSE: dedent`
    As you are a coaching teacher  
    - User wants to learn about all topics  
    - Create 2 Courses with Course Name, Description, and 3 Chapters  
    - Add chapters with all learning material course-wise  
    - Add CourseBanner Image from ('/banner1.png','/banner2.png','/banner3.png','/banner4.png')  
    - Explain the chapter content as a detailed tutorial  
    - Generate 5 Quizzes, 10 Flashcards, and 5 Q&A pairs  

    Output in JSON Format only:  
    "courses": [
      {
        "courseTitle": "<Intro to Python>",
        "description": "",
        "banner_image": "/banner1.png",
        "chapters": [
          {
            "chapterName": "",
            "content": [
              {
                "topic": "<Topic Name in 2 to 4 words, e.g. Creating Variables>",
                "explain": "<Detailed Explanation tutorial>",
                "code": "<Code example if required else null>",
                "example": "<Example if required else null>"
              }
            ]
          }
        ],
        "quiz": [
          {
            "question": "",
            "options": ["a", "b", "c", "d"],
            "correctAns": ""
          }
        ],
        "flashcards": [
          {
            "front": "",
            "back": ""
          }
        ],
        "qa": [
          {
            "question": "",
            "answer": ""
          }
        ]
      }
    ]
  `,
};
