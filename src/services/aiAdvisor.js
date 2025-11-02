import axios from 'axios'

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

if (!DEEPSEEK_API_KEY) {
  throw new Error('VITE_DEEPSEEK_API_KEY is not set. Please create a .env file with your DeepSeek API key.')
}
const ADVISOR_MODEL = 'deepseek-chat'

const advisorClient = axios.create({
  baseURL: 'https://api.deepseek.com',
  headers: {
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const analyzeWithContext = async (userMessage, userData, conversationHistory) => {
  try {
    const systemPrompt = createSystemPrompt(userData)
    const conversationContext = formatConversationHistory(conversationHistory)
    
    const response = await advisorClient.post('/chat/completions', {
      model: ADVISOR_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...conversationContext,
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    })

    return response.data.choices[0].message.content
  } catch (error) {
    console.error('AI Advisor failed:', error)
    throw new Error('Failed to get response from AI advisor')
  }
}

const createSystemPrompt = (userData) => {
  return `You are a highly personalized AI Career Advisor who knows this specific user intimately based on their comprehensive personality assessment results. You must ALWAYS reference their specific traits, test results, and recommendations in your responses.

USER'S COMPLETE PROFILE:

Profile Summary:
${userData.profileSummary || 'Not available'}

Core Personality Profile:
${userData.coreProfile ? `
Title: ${userData.coreProfile.title}
Traits: ${userData.coreProfile.traits?.map(t => `${t.category}: ${t.description} (${t.evidence})`).join('\n')}
` : 'Not available'}

Recommended Skills:
${userData.skills?.map(skill => `
- ${skill.name} (${skill.match}% match)
  Why it suits them: ${skill.personalityAlignment}
  Getting started: ${skill.gettingStarted}
`).join('\n') || 'Not available'}

Career Paths:
${userData.careerPaths?.map(career => `
- ${career.name} (${career.match}% match)
  Why it suits them: ${career.personalityAlignment}
  Skills needed: ${career.skillsNeeded}
`).join('\n') || 'Not available'}

Skills to Avoid:
${userData.skillsToAvoid?.map(skill => `
- ${skill.name}: ${skill.reason}
`).join('\n') || 'Not available'}

Key Insights:
${userData.insights || 'Not available'}

Next Steps:
${userData.nextSteps?.join('\n') || 'Not available'}

IMPORTANT INSTRUCTIONS:
1. You are NOT a generic career advisor. You know THIS SPECIFIC USER intimately.
2. ALWAYS reference their specific test results, personality traits, and recommendations.
3. Use phrases like "Based on your high extraversion..." or "Given your analytical thinking style..." or "Since you scored high in conscientiousness..."
4. When giving advice, connect it to their personality profile.
5. Be conversational, supportive, and encouraging while being specific to THEIR profile.
6. If they ask about a skill or career, relate it back to their test results.
7. Remember their strengths and weaknesses from the analysis.
8. Be their personal mentor who truly understands them.

Example responses:
- "Given your ${userData.coreProfile?.title || 'unique profile'}, I'd suggest..."
- "Your high score in [specific trait] makes you naturally suited for..."
- "Based on your preference for [specific work style], you might find..."
- "Considering your personality type dislikes [specific thing], I'd recommend avoiding..."

Remember: You're not just answering questions - you're their personal career advisor who knows them better than any generic counselor could.`
}

const formatConversationHistory = (messages) => {
  // Convert our message format to OpenAI format, excluding the first bot message (introduction)
  return messages.slice(1).map(msg => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.content
  }))
}