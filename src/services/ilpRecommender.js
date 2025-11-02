import axios from 'axios'
import ilpEvents from '../../ilpEventsComplete_Fixed.json'

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY

if (!DEEPSEEK_API_KEY) {
  throw new Error('VITE_DEEPSEEK_API_KEY is not set. Please create a .env file with your DeepSeek API key.')
}
const RECOMMENDATION_MODEL = 'deepseek-chat'

const recommendationClient = axios.create({
  baseURL: 'https://api.deepseek.com',
  headers: {
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const generateILPRecommendations = async (userProfile) => {
  try {
    const prompt = createILPRecommendationPrompt(userProfile)
    
    const response = await recommendationClient.post('/chat/completions', {
      model: RECOMMENDATION_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })

    const content = response.data.choices[0].message.content
    
    // Parse the response with error handling
    try {
      // Try direct parse first
      try {
        return JSON.parse(content)
      } catch (directParseError) {
        console.log('Direct parse failed, trying to extract JSON...')
      }
      
      // Look for JSON boundaries
      const jsonStart = content.indexOf('{')
      const jsonEnd = content.lastIndexOf('}')
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonContent = content.substring(jsonStart, jsonEnd + 1)
        return JSON.parse(jsonContent)
      }
      
      // Try to extract from markdown code block
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1])
      }
      
      throw new Error('No valid JSON found in response')
    } catch (parseError) {
      console.error('Failed to parse ILP recommendation response:', parseError)
      throw new Error('Unable to parse AI response for ILP recommendations')
    }
  } catch (error) {
    console.error('ILP recommendation generation failed:', error)
    throw new Error('Failed to generate ILP recommendations. Please try again.')
  }
}

const createILPRecommendationPrompt = (userProfile) => {
  // Format event list for prompt
  const eventsByDomain = {}
  
  Object.entries(ilpEvents.eventsByName).forEach(([name, event]) => {
    if (!eventsByDomain[event.domain]) {
      eventsByDomain[event.domain] = []
    }
    eventsByDomain[event.domain].push({
      crn: event.crn,
      name: event.titleEng,
      objectives: event.objectives?.substring(0, 200) // Truncate for prompt size
    })
  })

  const prompt = `You are an academic advisor at Lingnan University of Hong Kong matching students with Integrated Learning Programme (ILP) events based on their comprehensive personality assessment results.

## Student Personality Profile:
${formatUserProfile(userProfile)}

## Available ILP Events by Domain:

### CELD (Civic Education & Leadership Development):
${eventsByDomain.CELD?.map(e => `[${e.crn}] ${e.name}`).join('\n')}

### IED (Intellectual & Entrepreneurship Development):
${eventsByDomain.IED?.map(e => `[${e.crn}] ${e.name}`).join('\n')}

### SEW (Social & Emotional Well-being):
${eventsByDomain.SEW?.map(e => `[${e.crn}] ${e.name}`).join('\n')}

### PFW (Physical Fitness & Well-being):
${eventsByDomain.PFW?.map(e => `[${e.crn}] ${e.name}`).join('\n')}

### AES (Aesthetic Development):
${eventsByDomain.AES?.map(e => `[${e.crn}] ${e.name}`).join('\n')}

### RE (Residential Education):
${eventsByDomain.RE?.map(e => `[${e.crn}] ${e.name}`).join('\n')}

## Your Task:
Recommend 3-4 ILP events from EACH domain that best match this student's personality profile and interests.

## Matching Guidelines:

### For CELD (Civic & Leadership):
- High Extraversion → group leadership activities, team projects
- High Agreeableness → community service, volunteer programs
- Social RIASEC → interpersonal leadership roles
- Low Extraversion → behind-the-scenes civic roles

### For IED (Intellectual & Entrepreneurship):
- High Openness → innovation workshops, creative problem-solving
- Investigative RIASEC → research, technical skills training
- Enterprising RIASEC → business, startup, entrepreneurship events
- High Conscientiousness → structured learning programs

### For SEW (Social & Emotional Well-being):
- High Neuroticism → stress management, mindfulness workshops
- Low Extraversion → self-paced wellness, individual counseling
- High Extraversion → group therapy, peer support programs
- Interpersonal intelligence → emotional intelligence workshops

### For PFW (Physical Fitness):
- High Extraversion → team sports, group fitness classes
- Low Extraversion → individual activities (yoga, swimming, running)
- Kinesthetic intelligence → active, movement-based activities
- High Energy → intense workouts; Low Energy → gentle activities

### For AES (Aesthetic Development):
- High Openness → creative arts workshops, experimental arts
- Artistic RIASEC → hands-on art creation, performance
- Visual/Musical intelligence → relevant aesthetic experiences
- Low Openness → structured, traditional art appreciation

### For RE (Residential Education):
- High Extraversion → social hall activities, community building
- Low Extraversion → quiet study groups, individual development
- Cultural interests → multicultural programs
- Living preferences based on social needs

## IMPORTANT: Return ONLY valid JSON with this exact structure:
{
  "ilpRecommendations": {
    "CELD": {
      "primary": "[CRN] Event Name",
      "alternatives": [
        "[CRN] Event Name 1",
        "[CRN] Event Name 2",
        "[CRN] Event Name 3"
      ],
      "reasoning": "Brief explanation tied to specific personality traits"
    },
    "IED": {
      "primary": "[CRN] Event Name",
      "alternatives": [
        "[CRN] Event Name 1",
        "[CRN] Event Name 2",
        "[CRN] Event Name 3"
      ],
      "reasoning": "Brief explanation tied to specific personality traits"
    },
    "SEW": {
      "primary": "[CRN] Event Name",
      "alternatives": [
        "[CRN] Event Name 1",
        "[CRN] Event Name 2",
        "[CRN] Event Name 3"
      ],
      "reasoning": "Brief explanation tied to specific personality traits"
    },
    "PFW": {
      "primary": "[CRN] Event Name",
      "alternatives": [
        "[CRN] Event Name 1",
        "[CRN] Event Name 2",
        "[CRN] Event Name 3"
      ],
      "reasoning": "Brief explanation tied to specific personality traits"
    },
    "AES": {
      "primary": "[CRN] Event Name",
      "alternatives": [
        "[CRN] Event Name 1",
        "[CRN] Event Name 2",
        "[CRN] Event Name 3"
      ],
      "reasoning": "Brief explanation tied to specific personality traits"
    },
    "RE": {
      "primary": "[CRN] Event Name",
      "alternatives": [
        "[CRN] Event Name 1",
        "[CRN] Event Name 2",
        "[CRN] Event Name 3"
      ],
      "reasoning": "Brief explanation tied to specific personality traits"
    }
  },
  "overallTheme": "1-2 sentences about the overall recommendation pattern based on personality"
}

Rules:
1. Use EXACT event names with [CRN] prefix from the provided list
2. Must recommend from ALL 6 domains
3. Match events to personality traits, not random selection
4. Balance comfort zone with growth opportunities
5. Provide specific reasoning tied to measurable traits`

  return prompt
}

const formatUserProfile = (userProfile) => {
  let profileText = ''
  
  // Format Big Five scores if available
  if (userProfile.bigFive) {
    profileText += `\n### Big Five Personality Scores:\n`
    Object.entries(userProfile.bigFive).forEach(([trait, score]) => {
      profileText += `- ${trait}: ${score}% (${getLevel(score)})\n`
    })
  }
  
  // Format RIASEC codes if available
  if (userProfile.riasec) {
    profileText += `\n### RIASEC Career Interest Codes:\n`
    profileText += `Primary: ${userProfile.riasec.primary || 'Not specified'}\n`
    profileText += `Secondary: ${userProfile.riasec.secondary || 'Not specified'}\n`
    if (userProfile.riasec.scores) {
      Object.entries(userProfile.riasec.scores).forEach(([code, score]) => {
        profileText += `- ${code}: ${score}%\n`
      })
    }
  }
  
  // Format Multiple Intelligences if available
  if (userProfile.multipleIntelligences) {
    profileText += `\n### Multiple Intelligences:\n`
    const topIntelligences = Object.entries(userProfile.multipleIntelligences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
    topIntelligences.forEach(([type, score]) => {
      profileText += `- ${type}: ${score}% (Strong)\n`
    })
  }
  
  // Format CliftonStrengths if available
  if (userProfile.cliftonStrengths) {
    profileText += `\n### Top Clifton Strengths:\n`
    const topStrengths = userProfile.cliftonStrengths.slice(0, 5)
    topStrengths.forEach((strength, index) => {
      profileText += `${index + 1}. ${strength}\n`
    })
  }
  
  // Add career interests if available
  if (userProfile.careerInterests) {
    profileText += `\n### Career Interests:\n`
    userProfile.careerInterests.forEach(interest => {
      profileText += `- ${interest}\n`
    })
  }
  
  // Add user description if available
  if (userProfile.userDescription) {
    profileText += `\n### Additional Context:\n${userProfile.userDescription}\n`
  }
  
  // Add degree information if available
  if (userProfile.undergraduateDegree) {
    profileText += `\n### Academic Background:\n${userProfile.undergraduateDegree}\n`
  }
  
  return profileText || 'No personality profile data available'
}

const getLevel = (score) => {
  if (score >= 70) return 'High'
  if (score >= 30) return 'Moderate'
  return 'Low'
}

// Helper function to get domain full names
export const getDomainInfo = (domainCode) => {
  const domainInfo = ilpEvents.metadata.domains[domainCode]
  return domainInfo || { fullName: domainCode, nameChi: '' }
}

// Helper function to get event details by CRN
export const getEventByCRN = (crn) => {
  const event = Object.values(ilpEvents.eventsByName).find(e => e.crn === crn)
  return event || null
}

// Helper function to get all events for a domain
export const getEventsByDomain = (domainCode) => {
  return Object.values(ilpEvents.eventsByName).filter(e => e.domain === domainCode)
}