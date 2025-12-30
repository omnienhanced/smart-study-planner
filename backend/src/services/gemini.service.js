const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Helper to extract JSON
const extractJSON = (text) => {
  try {
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      throw new Error('No JSON found')
    }
    
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Parse error:', error.message)
    throw error
  }
}

const generateTimetable = async (subjects, examDates, difficulty, dailyHours) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 4096, // Increased limit
        temperature: 0.3, // Lower for more consistent output
      }
    })

    // MUCH simpler prompt to avoid truncation
    const prompt = `Generate 3-day study timetable in JSON. No markdown, no explanation.

Subjects: ${subjects.slice(0, 3).join(", ")}
Hours/day: ${dailyHours}

JSON only:
{"schedule":[{"day":"Mon","sessions":[{"subject":"Math","time":"9:00-11:00","priority":"high","topic":"Algebra"}]}]}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    console.log('Response length:', text.length)
    console.log('Full response:', text)
    
    // If response is too short, likely incomplete
    if (text.length < 50) {
      throw new Error('Response too short')
    }
    
    return extractJSON(text)
    
  } catch (error) {
    console.error('AI Error:', error.message)
    
    // Reliable fallback
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    return {
      schedule: days.map((day, dayIdx) => ({
        day: day,
        sessions: subjects.slice(0, 2).map((subject, idx) => ({
          subject: subject,
          time: `${9 + idx * 2}:00-${10 + idx * 2}:00`,
          priority: dayIdx < 3 ? "high" : "medium"
        }))
      }))
    }
  }
}

const summarizeNotes = async (notes) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.3
      }
    })

    const prompt = `Summarize in JSON only:
"${notes.substring(0, 1000)}"

Format:
{"summary":["point1","point2"],"keyTerms":["term1"]}`

    const result = await model.generateContent(prompt)
    return extractJSON(result.response.text())
    
  } catch (error) {
    console.error('Summary error:', error.message)
    return { 
      summary: ["Unable to generate summary"],
      keyTerms: []
    }
  }
}

const generateQuiz = async (notes) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.5
      }
    })

    const prompt = `Generate 3 quiz questions in JSON only:
"${notes.substring(0, 1000)}"

Format:
{"questions":[{"question":"Q?","options":["A","B","C","D"],"answer":0}]}`

    const result = await model.generateContent(prompt)
    return extractJSON(result.response.text())
    
  } catch (error) {
    console.error('Quiz error:', error.message)
    return { 
      questions: [{
        question: "Unable to generate quiz",
        options: ["N/A", "N/A", "N/A", "N/A"],
        answer: 0
      }]
    }
  }
}

module.exports = { generateTimetable, summarizeNotes, generateQuiz }