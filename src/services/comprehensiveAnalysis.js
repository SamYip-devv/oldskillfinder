import axios from 'axios'
import { generateILPRecommendations } from './ilpRecommender'

const ANALYSIS_MODEL = 'deepseek-chat'

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DeepSeek API key is not configured. Please set VITE_DEEPSEEK_API_KEY environment variable in your deployment platform.')
  }
  return apiKey
}

const createAnalysisClient = () => {
  return axios.create({
    baseURL: 'https://api.deepseek.com',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json'
    }
  })
}

// Helper function to add ILP recommendations to analysis result
const addILPRecommendations = async (analysisResult, structuredData, userDescription, undergraduateDegree) => {
  try {
    const userProfile = extractUserProfile(structuredData, analysisResult, userDescription, undergraduateDegree)
    const ilpRecommendations = await generateILPRecommendations(userProfile)

    // Format ILP recommendations in the same style as other recommendations
    const ilpEventsList = []
    if (ilpRecommendations && ilpRecommendations.ilpRecommendations) {
      // Take top ILP events from different domains
      const domains = ['CELD', 'IED', 'SEW', 'PFW', 'AES', 'RE']
      domains.forEach(domain => {
        if (ilpRecommendations.ilpRecommendations[domain]) {
          const domainRec = ilpRecommendations.ilpRecommendations[domain]
          if (domainRec.primary) {
            ilpEventsList.push({
              name: domainRec.primary,
              description: domainRec.reasoning || `Recommended based on your personality profile for ${domain} domain`
            })
          }
        }
      })
    }

    // Ensure we have at least 2 career paths
    if (!analysisResult.careerPaths || analysisResult.careerPaths.length < 2) {
      // Generate default career paths based on available data
      const defaultCareers = []

      // Based on degree if available
      if (undergraduateDegree && undergraduateDegree.includes('Data Science')) {
        defaultCareers.push({
          name: 'Data Analyst',
          description: 'Analyze and interpret complex data to help organizations make informed decisions',
          match: 75,
          personalityAlignment: 'Combines analytical thinking with practical application of data science skills',
          skillsNeeded: 'SQL, Python, Data Visualization, Statistical Analysis',
          dailyRealities: 'Working with datasets, creating reports, presenting insights to stakeholders',
          careerProgression: 'Junior Analyst → Senior Analyst → Lead Analyst → Analytics Manager'
        })
        defaultCareers.push({
          name: 'Business Intelligence Developer',
          description: 'Design and develop BI solutions to transform data into actionable insights',
          match: 72,
          personalityAlignment: 'Bridges technical skills with business understanding',
          skillsNeeded: 'BI Tools, Dashboard Design, SQL, Business Acumen',
          dailyRealities: 'Creating dashboards, automating reports, collaborating with business teams',
          careerProgression: 'BI Developer → Senior BI Developer → BI Architect → BI Manager'
        })
      }

      // Generic careers based on personality
      if (defaultCareers.length < 2) {
        defaultCareers.push({
          name: 'Project Coordinator',
          description: 'Organize and coordinate project activities to ensure successful completion',
          match: 70,
          personalityAlignment: 'Suitable for organized individuals who enjoy structured work',
          skillsNeeded: 'Project Management, Communication, Organization, Time Management',
          dailyRealities: 'Managing timelines, coordinating teams, tracking progress, reporting to stakeholders',
          careerProgression: 'Coordinator → Project Manager → Senior PM → Program Manager'
        })
        defaultCareers.push({
          name: 'Digital Marketing Specialist',
          description: 'Create and implement digital marketing strategies to promote products and services',
          match: 68,
          personalityAlignment: 'Combines creativity with analytical thinking and digital skills',
          skillsNeeded: 'Social Media, Content Creation, Analytics, SEO/SEM',
          dailyRealities: 'Creating content, analyzing campaigns, managing social media, optimizing digital presence',
          careerProgression: 'Marketing Assistant → Specialist → Senior Specialist → Marketing Manager'
        })
      }

      analysisResult.careerPaths = [...(analysisResult.careerPaths || []), ...defaultCareers].slice(0, 5)
    }

    // Add ILP recommendations to the analysis result
    const finalResult = {
      ...analysisResult,
      ilpEvents: ilpEventsList.slice(0, 6), // Take top 6 events (one from each domain)
      ilpTheme: ilpRecommendations.overallTheme,
      ilpRecommendations: ilpRecommendations.ilpRecommendations // Full ILP data for page 2
    }
    console.log('Analysis complete with ILP recommendations')
    return finalResult
  } catch (ilpError) {
    console.error('Failed to generate ILP recommendations:', ilpError)
    // Return analysis without ILP recommendations if they fail
    return analysisResult
  }
}

export const generateComprehensiveAnalysis = async (structuredData, userDescription = '', undergraduateDegree = '') => {
  try {
    const prompt = createComprehensivePrompt(structuredData, userDescription, undergraduateDegree)

    const analysisClient = createAnalysisClient()
    const response = await analysisClient.post('/chat/completions', {
      model: ANALYSIS_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 6000
    })

    const content = response.data.choices[0].message.content
    
    // Parse the response with better error handling
    try {
      // First try to parse directly
      try {
        const analysisResult = JSON.parse(content)
        // Add ILP recommendations
        return await addILPRecommendations(analysisResult, structuredData, userDescription, undergraduateDegree)
      } catch (directParseError) {
        // If direct parse fails, try to extract JSON
        console.log('Direct parse failed, trying to extract JSON...')
      }
      
      // Look for JSON boundaries with multiple strategies
      let jsonContent = content
      
      // Strategy 1: Find outermost braces
      const jsonStart = content.indexOf('{')
      const jsonEnd = content.lastIndexOf('}')
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonContent = content.substring(jsonStart, jsonEnd + 1)
        
        // Try to fix common JSON issues
        jsonContent = jsonContent
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix unquoted keys
          .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace single quotes with double quotes
        
        try {
          const analysisResult = JSON.parse(jsonContent)
          // Add ILP recommendations
          return await addILPRecommendations(analysisResult, structuredData, userDescription, undergraduateDegree)
        } catch (cleanupError) {
          console.log('Cleanup attempt failed:', cleanupError)
        }
      }
      
      // Strategy 2: Look for JSON blocks in markdown
      const jsonBlocks = content.match(/```json\s*([\s\S]*?)\s*```/g)
      if (jsonBlocks && jsonBlocks.length > 0) {
        const jsonBlock = jsonBlocks[0].replace(/```json\s*|\s*```/g, '')
        try {
          const analysisResult = JSON.parse(jsonBlock)
          // Add ILP recommendations
          return await addILPRecommendations(analysisResult, structuredData, userDescription, undergraduateDegree)
        } catch (blockError) {
          console.log('JSON block parse failed:', blockError)
        }
      }
      
      throw new Error('No valid JSON found in response')
    } catch (parseError) {
      console.error('Failed to parse analysis response:', parseError)
      console.error('Raw response content:', content)
      console.error('Response length:', content.length)
      
      // Try to provide a more helpful error message
      if (content.length > 50000) {
        throw new Error('Response too large. Please try again with fewer test results.')
      } else if (!content.includes('{')) {
        throw new Error('AI returned text instead of JSON. Please try again.')
      } else {
        throw new Error('Unable to parse AI response. The response may be malformed. Please try again.')
      }
    }
  } catch (error) {
    console.error('Comprehensive analysis failed:', error)
    throw new Error('Analysis failed. Please try again.')
  }
}

const createComprehensivePrompt = (structuredData, userDescription, undergraduateDegree) => {
  let prompt = `You are an expert career counselor and personality analyst. You have access to comprehensive personality test results and need to provide a detailed, interconnected analysis that shows how all the test results work together to create a clear professional profile.

IMPORTANT: Your analysis should be like a professional career assessment report - detailed, interconnected, and with specific examples of how different test results support each other.

Here are the personality test results:

`

  // Add each test's data
  Object.entries(structuredData).forEach(([testType, data]) => {
    if (data && data.rawText) {
      const testNames = {
        big5: 'Big Five Personality Test Results',
        multipleIntelligence: 'Multiple Intelligence Test Results',
        riasec: 'RIASEC Career Interest Test Results',
        cliftonStrengths: 'CliftonStrengths Assessment Results'
      }
      
      prompt += `\n## ${testNames[testType]}:\n${data.rawText}\n`
    }
  })

  // Add context information
  if (undergraduateDegree && undergraduateDegree.trim()) {
    // Extract satisfaction level if present
    const satisfactionMatch = undergraduateDegree.match(/\[SATISFACTION_LEVEL: (\d)\]/)
    const satisfactionLevel = satisfactionMatch ? parseInt(satisfactionMatch[1]) : 3
    const degreeText = undergraduateDegree.replace(/\s*\[SATISFACTION_LEVEL: \d\]/, '')
    
    let satisfactionDescription = ""
    switch(satisfactionLevel) {
      case 1: satisfactionDescription = "Really dislikes/hates their major"; break;
      case 2: satisfactionDescription = "Is not happy with their major"; break;
      case 3: satisfactionDescription = "Feels neutral about their major"; break;
      case 4: satisfactionDescription = "Likes their major"; break;
      case 5: satisfactionDescription = "Loves their major"; break;
    }
    
    prompt += `\n## Current Education:\nStudying: ${degreeText}\nSatisfaction with major: ${satisfactionDescription} (Level ${satisfactionLevel}/5)\n\nIMPORTANT: This student's feelings about their major (${satisfactionDescription}) should significantly influence your recommendations. If they hate their major, suggest skills that could lead to alternative career paths. If they love it, suggest complementary skills that enhance their current path.\n`
  }

  if (userDescription && userDescription.trim()) {
    prompt += `\n## Additional Context:\n${userDescription}\n`
  }

  prompt += `

CRITICAL INSTRUCTIONS:

1. **Cross-Reference All Tests**: Don't analyze each test in isolation. Show how Big 5 traits connect to RIASEC interests, how CliftonStrengths support career directions, how Multiple Intelligences explain learning preferences, etc.

2. **Create a Unified Profile**: Start with a compelling 2-3 paragraph overview that synthesizes all results into a coherent professional identity.

3. **Use Specific Data Points**: Reference actual percentiles, rankings, and scores from the tests. Don't be generic.

4. **Focus on Hard Skills**: Recommend concrete, learnable skills like vlogging, programming, photography, baking, digital marketing, web design, content creation, data analysis, etc. These should be practical skills they can start learning immediately.

5. **Professional Depth**: MUST provide AT LEAST 3 detailed career recommendations (minimum 3, maximum 7) with comprehensive explanations. Even with limited test data, use available personality patterns and the student's degree to suggest suitable careers. NEVER return empty careerPaths.

6. **Actionable Insights**: Include specific next steps, skill development recommendations, and learning approaches based on their test results.

Provide your analysis in this JSON format:

{
  "profileSummary": "A comprehensive 3-4 paragraph analysis that reads like the introduction to a professional assessment report. Start with 'Based on a comprehensive analysis of your personality and aptitude test results, a clear and powerful profile emerges:' and then describe their core professional identity, key traits with specific percentiles, and overall profile.",
  "coreProfile": {
    "title": "A catchy professional identity title (e.g., 'The Action-Oriented Leader')",
    "traits": [
      {
        "category": "Highly Energetic & Social",
        "evidence": "Extraversion 93rd percentile",
        "description": "You are energized by interaction and are comfortable taking the lead in social and professional settings."
      },
      {
        "category": "Driven & Disciplined", 
        "evidence": "Conscientiousness 80th, Achiever & Discipline Strengths",
        "description": "You have an innate drive to accomplish goals and the organizational skills to see them through."
      }
    ]
  },
  "skills": [
    {
      "name": "Practical skill name (e.g., Vlogging, Programming, Photography, Baking, Digital Marketing, etc.)",
      "description": "Why this specific hard skill fits their personality perfectly",
      "match": 90,
      "personalityAlignment": "Detailed explanation connecting multiple test results to this concrete skill - reference specific Big 5 scores, RIASEC interests, CliftonStrengths, and intelligence types",
      "gettingStarted": "Concrete first steps they can take to begin learning this skill right now"
    }
  ],
  "careerPaths": [
    {
      "name": "Detailed Career Path Name",
      "description": "Comprehensive description of this career and its appeal",
      "match": 88,
      "personalityAlignment": "Multi-paragraph explanation of why this career fits, referencing specific test results and scores",
      "skillsNeeded": "Key skills they should develop for this path",
      "dailyRealities": "What their day-to-day work would look like in this role",
      "careerProgression": "How they could advance in this field"
    },
    {
      "name": "Second Career Path (REQUIRED)",
      "description": "Another suitable career option",
      "match": 85,
      "personalityAlignment": "Why this fits their profile",
      "skillsNeeded": "Required skills",
      "dailyRealities": "Daily work activities",
      "careerProgression": "Career growth path"
    },
    {
      "name": "Third Career Path (REQUIRED - minimum 3 careers)",
      "description": "Additional career option",
      "match": 82,
      "personalityAlignment": "Connection to their traits",
      "skillsNeeded": "Skills to develop",
      "dailyRealities": "What they would do",
      "careerProgression": "Advancement opportunities"
    }
  ],
  "learningRecommendations": [
    {
      "approach": "Learning approach that fits their intelligence profile",
      "reasoning": "Why this approach works for their specific test results"
    }
  ],
  "workEnvironment": [
    {
      "name": "Ideal Environment Type",
      "description": "Detailed description of work environment that suits their personality"
    }
  ],
  "skillsToAvoid": [
    {
      "name": "Skill/Career to Avoid",
      "reason": "Detailed explanation of personality mismatches based on test results",
      "personalityMismatch": "Specific traits that conflict"
    }
  ],
  "insights": "A comprehensive 3-4 paragraph analysis that ties everything together, discusses their unique combination of traits, potential challenges, and overall career outlook",
  "nextSteps": [
    "Specific, actionable step based on their results",
    "Another concrete next step",
    "Third actionable recommendation"
  ]
}

CRITICAL JSON FORMATTING REQUIREMENTS:
- You MUST respond with ONLY valid JSON - no markdown, no explanations, no additional text
- Start your response with { and end with }
- Use double quotes for all strings
- Do not include trailing commas
- Ensure all brackets and braces are properly closed
- If you need to include quotes within strings, escape them with \"
- MANDATORY: The "careerPaths" array MUST contain AT LEAST 3 career recommendations
- Even with limited test data, suggest careers based on available information and general patterns

Remember: This should read like a professional career assessment report, not generic advice. Use their actual test scores and create connections between different results. Be specific, detailed, and insightful.

RESPOND WITH ONLY THE JSON OBJECT - NO OTHER TEXT BEFORE OR AFTER.`

  return prompt
}

const extractUserProfile = (structuredData, analysisResult, userDescription = '', undergraduateDegree = '') => {
  const userProfile = {
    bigFive: {},
    riasec: {},
    multipleIntelligences: {},
    cliftonStrengths: [],
    careerInterests: [],
    userDescription: userDescription,
    undergraduateDegree: undergraduateDegree
  }

  // Parse raw text from tests to extract scores
  Object.entries(structuredData).forEach(([testType, data]) => {
    if (!data || !data.rawText) return

    const text = data.rawText.toLowerCase()

    // Extract Big Five scores from raw text
    if (testType === 'big5') {
      const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
      traits.forEach(trait => {
        // Look for percentile patterns like "openness: 85%" or "openness 85th percentile"
        const percentileMatch = text.match(new RegExp(`${trait}[:\s]+([0-9]+)(?:th)?\s*(?:percentile|%)`,'i'))
        if (percentileMatch) {
          userProfile.bigFive[trait.charAt(0).toUpperCase() + trait.slice(1)] = parseInt(percentileMatch[1])
        }
        // Also check for score patterns
        const scoreMatch = text.match(new RegExp(`${trait}[:\s]+score[:\s]+([0-9]+)`,'i'))
        if (scoreMatch && !userProfile.bigFive[trait.charAt(0).toUpperCase() + trait.slice(1)]) {
          userProfile.bigFive[trait.charAt(0).toUpperCase() + trait.slice(1)] = parseInt(scoreMatch[1])
        }
      })
    }

    // Extract RIASEC scores from raw text
    if (testType === 'riasec') {
      const codes = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional']
      userProfile.riasec.scores = {}

      codes.forEach(code => {
        // Look for score patterns
        const scoreMatch = text.match(new RegExp(`${code}[:\s]+([0-9]+)`,'i'))
        if (scoreMatch) {
          const codeInitial = code.charAt(0).toUpperCase()
          userProfile.riasec.scores[codeInitial] = parseInt(scoreMatch[1])
        }
      })

      // Find top codes (often mentioned as "your code is RIA" or similar)
      const codeMatch = text.match(/(?:code|type)[\s:]+([RIASEC]{2,3})/i)
      if (codeMatch) {
        const codes = codeMatch[1].toUpperCase().split('')
        if (codes.length > 0) userProfile.riasec.primary = codes[0]
        if (codes.length > 1) userProfile.riasec.secondary = codes[1]
      }

      // If no explicit code, derive from scores
      if (!userProfile.riasec.primary && Object.keys(userProfile.riasec.scores).length > 0) {
        const sortedCodes = Object.entries(userProfile.riasec.scores)
          .sort(([,a], [,b]) => b - a)
        if (sortedCodes.length > 0) {
          userProfile.riasec.primary = sortedCodes[0][0]
        }
        if (sortedCodes.length > 1) {
          userProfile.riasec.secondary = sortedCodes[1][0]
        }
      }
    }

    // Extract Multiple Intelligences from raw text
    if (testType === 'multipleIntelligence') {
      const intelligences = [
        'linguistic', 'logical-mathematical', 'spatial', 'bodily-kinesthetic',
        'musical', 'interpersonal', 'intrapersonal', 'naturalistic'
      ]

      intelligences.forEach(intel => {
        const cleanIntel = intel.replace('-', ' ')
        // Look for score patterns
        const scoreMatch = text.match(new RegExp(`${cleanIntel}[:\s]+([0-9]+)`,'i'))
        if (scoreMatch) {
          userProfile.multipleIntelligences[intel] = parseInt(scoreMatch[1])
        }
      })
    }

    // Extract CliftonStrengths from raw text
    if (testType === 'cliftonStrengths') {
      // Look for numbered list of strengths
      const strengthMatches = text.match(/\d+\.\s*([A-Za-z]+)/g)
      if (strengthMatches) {
        userProfile.cliftonStrengths = strengthMatches.map(match => {
          const cleanMatch = match.replace(/\d+\.\s*/, '')
          return cleanMatch.charAt(0).toUpperCase() + cleanMatch.slice(1)
        }).slice(0, 10) // Take top 10
      }
    }
  })

  // Extract career interests from analysis result
  if (analysisResult && analysisResult.careerPaths) {
    userProfile.careerInterests = analysisResult.careerPaths
      .filter(cp => cp && (cp.name || cp.title))
      .map(cp => cp.name || cp.title)
      .slice(0, 5) // Take top 5 career interests
  }

  // Provide some default values if tests are missing
  if (Object.keys(userProfile.bigFive).length === 0) {
    // Use moderate defaults if no Big Five data
    userProfile.bigFive = {
      Openness: 50,
      Conscientiousness: 50,
      Extraversion: 50,
      Agreeableness: 50,
      Neuroticism: 50
    }
  }

  return userProfile
}