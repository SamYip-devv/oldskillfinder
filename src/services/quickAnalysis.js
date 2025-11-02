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

export const analyzeQuickAssessment = async (answers) => {
  try {
    const prompt = createQuickAnalysisPrompt(answers)

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
      max_tokens: 4000
    })

    const content = response.data.choices[0].message.content

    // Parse the response
    let analysis
    try {
      // Remove markdown code blocks if present
      const jsonContent = content.replace(/```json\s*|\s*```/g, '')
      analysis = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error('Failed to parse quick analysis response:', parseError)
      throw new Error('Unable to parse AI response. Please try again.')
    }

    // Generate ILP recommendations based on the quick assessment analysis
    try {
      const userProfile = createUserProfileFromQuickAnalysis(answers, analysis)
      const ilpRecommendations = await generateILPRecommendations(userProfile)

      // Add ILP recommendations to the analysis result
      analysis.ilpRecommendations = ilpRecommendations.ilpRecommendations
      analysis.ilpOverallTheme = ilpRecommendations.overallTheme
    } catch (ilpError) {
      console.error('Failed to generate ILP recommendations:', ilpError)
      // Continue without ILP recommendations if generation fails
    }

    return analysis
  } catch (error) {
    console.error('Quick analysis failed:', error)
    throw new Error('Analysis failed. Please try again.')
  }
}

// Helper function to create user profile for ILP recommendations
const createUserProfileFromQuickAnalysis = (answers, analysis) => {
  const profile = {
    // Derive Big Five traits from answers
    bigFive: deriveBigFiveFromAnswers(answers),

    // Derive RIASEC from answers
    riasec: deriveRIASECFromAnswers(answers),

    // Include user description
    userDescription: answers.aboutYourself,

    // Include degree if provided
    undergraduateDegree: answers.includeMajor ? answers.undergraduateDegree : '',

    // Add career interests from analysis
    careerInterests: analysis.careerPaths?.map(path => path.name) || []
  }

  return profile
}

// Derive Big Five personality traits from quick assessment answers
const deriveBigFiveFromAnswers = (answers) => {
  const traits = {
    Openness: 50,
    Conscientiousness: 50,
    Extraversion: 50,
    Agreeableness: 50,
    Neuroticism: 50
  }

  // Extraversion
  if (answers.socialEnergy === 'energized') traits.Extraversion = 80
  else if (answers.socialEnergy === 'exhausted') traits.Extraversion = 20
  else if (answers.socialEnergy === 'need-break') traits.Extraversion = 35
  else traits.Extraversion = 50

  if (answers.workStyle === 'large-team') traits.Extraversion = Math.min(100, traits.Extraversion + 15)
  else if (answers.workStyle === 'independent') traits.Extraversion = Math.max(0, traits.Extraversion - 15)

  // Openness
  if (answers.problemSolving === 'creative') traits.Openness = 85
  else if (answers.problemSolving === 'analyze') traits.Openness = 40

  if (answers.excitingProject === 'innovation') traits.Openness = Math.min(100, traits.Openness + 20)
  if (answers.workEnvironment === 'creative') traits.Openness = Math.min(100, traits.Openness + 15)
  else if (answers.workEnvironment === 'structured') traits.Openness = Math.max(0, traits.Openness - 20)

  // Conscientiousness
  if (answers.problemSolving === 'analyze') traits.Conscientiousness = 75
  if (answers.naturalStrength === 'planning') traits.Conscientiousness = 85
  if (answers.workPace === 'steady') traits.Conscientiousness = 80
  else if (answers.workPace === 'bursts') traits.Conscientiousness = 35

  if (answers.avoidActivity === 'detail') traits.Conscientiousness = Math.max(0, traits.Conscientiousness - 20)

  // Agreeableness
  if (answers.naturalStrength === 'emotional') traits.Agreeableness = 85
  if (answers.teamRole === 'mediator') traits.Agreeableness = 90
  else if (answers.teamRole === 'leader') traits.Agreeableness = 55

  if (answers.avoidActivity === 'conflict') traits.Agreeableness = Math.min(100, traits.Agreeableness + 15)
  if (answers.workEnvironment === 'supportive') traits.Agreeableness = Math.min(100, traits.Agreeableness + 10)

  // Neuroticism
  if (answers.stressCoping === 'thrive') traits.Neuroticism = 25
  else if (answers.stressCoping === 'struggle') traits.Neuroticism = 75
  else if (answers.stressCoping === 'methodical') traits.Neuroticism = 40
  else traits.Neuroticism = 50

  return traits
}

// Derive RIASEC codes from quick assessment answers
const deriveRIASECFromAnswers = (answers) => {
  const scores = {
    Realistic: 0,
    Investigative: 0,
    Artistic: 0,
    Social: 0,
    Enterprising: 0,
    Conventional: 0
  }

  // Map answers to RIASEC scores
  if (answers.freeTime === 'tinker') scores.Realistic += 30
  if (answers.freeTime === 'analyze') scores.Investigative += 30
  if (answers.freeTime === 'create') scores.Artistic += 30
  if (answers.freeTime === 'socialize') scores.Social += 30

  if (answers.excitingProject === 'technical') scores.Investigative += 25
  if (answers.excitingProject === 'innovation') scores.Artistic += 20
  if (answers.excitingProject === 'impact') scores.Social += 25
  if (answers.excitingProject === 'improvement') scores.Conventional += 15

  if (answers.futureVision === 'expert') scores.Investigative += 20
  if (answers.futureVision === 'leader') scores.Enterprising += 30
  if (answers.futureVision === 'entrepreneur') scores.Enterprising += 25
  if (answers.futureVision === 'innovator') scores.Artistic += 25

  if (answers.naturalStrength === 'technical') scores.Investigative += 20
  if (answers.naturalStrength === 'ideas') scores.Artistic += 20
  if (answers.naturalStrength === 'emotional') scores.Social += 25
  if (answers.naturalStrength === 'planning') scores.Conventional += 20

  if (answers.teamRole === 'leader') scores.Enterprising += 20
  if (answers.teamRole === 'innovator') scores.Artistic += 15
  if (answers.teamRole === 'mediator') scores.Social += 20
  if (answers.teamRole === 'executor') scores.Conventional += 15

  // Sort and get top codes
  const sortedCodes = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .map(([code, score]) => ({ code, score }))

  return {
    primary: sortedCodes[0]?.code || 'Investigative',
    secondary: sortedCodes[1]?.code || 'Artistic',
    scores: Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, Math.min(100, v * 2)]))
  }
}

const createQuickAnalysisPrompt = (answers) => {
  // Map answers to personality traits
  const personalityProfile = mapAnswersToPersonality(answers)
  
  return `You are an expert career counselor analyzing a quick personality assessment. Based on the user's responses, provide personalized skill and career recommendations.

USER PROFILE:
- Undergraduate Degree: ${answers.undergraduateDegree}
- Major Satisfaction: ${getMajorSatisfactionText(answers.majorSatisfaction)}
- Include Major in Recommendations: ${answers.includeMajor ? 'Yes - suggest complementary skills' : 'No - suggest alternative paths'}
- About Them: ${answers.aboutYourself}

PERSONALITY ASSESSMENT RESULTS:

Work Style & Preferences:
- Work Style: ${getWorkStyleDescription(answers.workStyle)}
- Problem Solving: ${getProblemSolvingDescription(answers.problemSolving)}
- Social Energy: ${getSocialEnergyDescription(answers.socialEnergy)}
- Learning Preference: ${getLearningDescription(answers.learningPreference)}
- Work Environment: ${getEnvironmentDescription(answers.workEnvironment)}

Interests & Strengths:
- Free Time Activities: ${getFreeTimeDescription(answers.freeTime)}
- Exciting Projects: ${getProjectDescription(answers.excitingProject)}
- Natural Strengths: ${getStrengthDescription(answers.naturalStrength)}
- Activities to Avoid: ${getAvoidDescription(answers.avoidActivity)}
- Future Vision: ${getFutureDescription(answers.futureVision)}

Values & Motivations:
- Primary Motivation: ${getMotivationDescription(answers.motivation)}
- Stress Response: ${getStressDescription(answers.stressCoping)}
- Team Role: ${getTeamRoleDescription(answers.teamRole)}
- Decision Making: ${getDecisionDescription(answers.decisionMaking)}
- Work Pace: ${getWorkPaceDescription(answers.workPace)}

DERIVED PERSONALITY TRAITS:
${personalityProfile}

Based on this quick assessment, provide recommendations that are:
1. Specific and actionable
2. Aligned with their personality and interests
3. Complementary to their undergraduate degree
4. Realistic to learn within 6-12 months

Provide your analysis in this JSON format:

{
  "profileSummary": "A 2-3 paragraph summary that captures their personality, strengths, and potential. Start with 'Based on your quick assessment...' and make it personal and insightful.",
  "coreProfile": {
    "title": "A catchy 3-4 word description (e.g., 'The Creative Problem-Solver')",
    "traits": [
      {
        "category": "Primary Strength",
        "evidence": "Based on your answers",
        "description": "What this means for your career"
      }
    ]
  },
  "skills": [
    {
      "name": "Specific skill name (e.g., UI/UX Design, Data Analysis, Content Creation)",
      "description": "Why this skill matches their personality and interests",
      "match": 85,
      "personalityAlignment": "How their specific traits make them suited for this",
      "gettingStarted": "Concrete first steps to begin learning"
    }
  ],
  "careerPaths": [
    {
      "name": "Specific Career Title",
      "description": "What this career involves",
      "match": 85,
      "personalityAlignment": "Why this fits their personality profile",
      "skillsNeeded": "Key skills to develop for this path"
    }
  ],
  "skillsToAvoid": [
    {
      "name": "Skill that doesn't match",
      "reason": "Why this might not be a good fit",
      "personalityMismatch": "Specific traits that conflict"
    }
  ],
  "insights": "Key insights about their personality and potential",
  "nextSteps": [
    "Specific action item 1",
    "Specific action item 2",
    "Specific action item 3"
  ]
}

Remember: This is a quick assessment, so focus on 3-5 strong skill recommendations and 3-4 career paths. Be encouraging but realistic.`
}

// Helper functions to map answers to descriptions
const getMajorSatisfactionText = (level) => {
  const descriptions = {
    1: "Really dislikes their major - looking for alternative paths",
    2: "Not very happy with their major - open to new directions",
    3: "Neutral about their major - exploring complementary skills",
    4: "Likes their major - wants to enhance with additional skills",
    5: "Loves their major - seeking to specialize and excel"
  }
  return descriptions[level] || descriptions[3]
}

const getWorkStyleDescription = (style) => {
  const descriptions = {
    'independent': "Prefers working alone with full autonomy (high independence, lower agreeableness)",
    'small-team': "Enjoys small team collaboration (moderate extraversion, high agreeableness)",
    'large-team': "Thrives in large, diverse groups (high extraversion, high openness)",
    'flexible': "Adapts to different work styles (balanced personality, high adaptability)"
  }
  return descriptions[style] || ""
}

const getProblemSolvingDescription = (approach) => {
  const descriptions = {
    'analyze': "Systematic analyzer (high conscientiousness, analytical thinking)",
    'creative': "Creative innovator (high openness, divergent thinking)",
    'research': "Research-oriented (investigative, learning-focused)",
    'intuition': "Intuitive actor (spontaneous, risk-tolerant)"
  }
  return descriptions[approach] || ""
}

const getSocialEnergyDescription = (energy) => {
  const descriptions = {
    'energized': "Highly extraverted - gains energy from social interaction",
    'neutral': "Ambiverted - balanced social needs",
    'need-break': "Introverted - needs quiet time to recharge",
    'exhausted': "Highly introverted - requires minimal social interaction"
  }
  return descriptions[energy] || ""
}

const getLearningDescription = (preference) => {
  const descriptions = {
    'doing': "Kinesthetic learner - learns by doing",
    'visual': "Visual learner - learns by observing",
    'reading': "Verbal learner - learns through text",
    'discussing': "Social learner - learns through dialogue"
  }
  return descriptions[preference] || ""
}

const getEnvironmentDescription = (environment) => {
  const descriptions = {
    'structured': "Prefers organized, process-driven environments",
    'dynamic': "Thrives in fast-paced, changing environments",
    'creative': "Needs flexible, experimental spaces",
    'supportive': "Values collaborative, mentorship-rich environments"
  }
  return descriptions[environment] || ""
}

const getFreeTimeDescription = (activity) => {
  const descriptions = {
    'create': "Creative pursuits (artistic personality)",
    'tinker': "Hands-on building (realistic personality)",
    'analyze': "Problem-solving activities (investigative personality)",
    'socialize': "Social organizing (social personality)"
  }
  return descriptions[activity] || ""
}

const getProjectDescription = (project) => {
  const descriptions = {
    'innovation': "Creating new things (entrepreneurial spirit)",
    'improvement': "Optimizing systems (analytical mindset)",
    'impact': "Helping others (social orientation)",
    'technical': "Technical challenges (investigative nature)"
  }
  return descriptions[project] || ""
}

const getStrengthDescription = (strength) => {
  const descriptions = {
    'ideas': "Creative ideation and brainstorming",
    'planning': "Organization and strategic planning",
    'emotional': "Emotional intelligence and support",
    'technical': "Technical expertise and problem-solving"
  }
  return descriptions[strength] || ""
}

const getAvoidDescription = (avoid) => {
  const descriptions = {
    'repetitive': "Dislikes routine (needs variety and stimulation)",
    'public': "Avoids spotlight (introverted tendencies)",
    'detail': "Dislikes minutiae (big-picture thinker)",
    'conflict': "Avoids confrontation (harmony-seeking)"
  }
  return descriptions[avoid] || ""
}

const getFutureDescription = (vision) => {
  const descriptions = {
    'expert': "Seeks deep expertise (specialist mindset)",
    'leader': "Aspires to leadership (enterprising nature)",
    'entrepreneur': "Wants independence (entrepreneurial spirit)",
    'innovator': "Aims to innovate (creative visionary)"
  }
  return descriptions[vision] || ""
}

const getMotivationDescription = (motivation) => {
  const descriptions = {
    'impact': "Purpose-driven and altruistic",
    'growth': "Learning-focused with growth mindset",
    'recognition': "Achievement-oriented and ambitious",
    'balance': "Lifestyle-focused and balanced"
  }
  return descriptions[motivation] || ""
}

const getStressDescription = (coping) => {
  const descriptions = {
    'thrive': "Performs well under pressure",
    'methodical': "Becomes more organized when stressed",
    'support': "Seeks collaboration under stress",
    'struggle': "Needs low-stress environments"
  }
  return descriptions[coping] || ""
}

const getTeamRoleDescription = (role) => {
  const descriptions = {
    'leader': "Natural leader and direction-setter",
    'mediator': "Diplomatic harmony-keeper",
    'innovator': "Creative idea generator",
    'executor': "Reliable task completer"
  }
  return descriptions[role] || ""
}

const getDecisionDescription = (style) => {
  const descriptions = {
    'data': "Data-driven decision maker",
    'intuition': "Intuitive decision maker",
    'others': "Collaborative decision maker",
    'quick': "Fast, adaptive decision maker"
  }
  return descriptions[style] || ""
}

const getWorkPaceDescription = (pace) => {
  const descriptions = {
    'steady': "Consistent, methodical worker",
    'bursts': "Works in creative bursts",
    'deadline': "Deadline-driven producer",
    'flexible': "Adaptable work patterns"
  }
  return descriptions[pace] || ""
}

const mapAnswersToPersonality = (answers) => {
  let traits = []

  // Extraversion/Introversion
  if (answers.socialEnergy === 'energized' || answers.workStyle === 'large-team') {
    traits.push("High Extraversion: Energized by social interaction, enjoys collaborative environments")
  } else if (answers.socialEnergy === 'exhausted' || answers.workStyle === 'independent') {
    traits.push("High Introversion: Prefers independent work, needs quiet time to recharge")
  } else {
    traits.push("Moderate Extraversion: Balanced social needs, adaptable to different settings")
  }

  // Openness
  if (answers.problemSolving === 'creative' || answers.excitingProject === 'innovation') {
    traits.push("High Openness: Creative, innovative, enjoys new experiences")
  } else if (answers.workEnvironment === 'structured') {
    traits.push("Lower Openness: Prefers proven methods and structured approaches")
  }

  // Conscientiousness
  if (answers.problemSolving === 'analyze' || answers.naturalStrength === 'planning') {
    traits.push("High Conscientiousness: Organized, detail-oriented, systematic")
  } else if (answers.workPace === 'bursts' || answers.avoidActivity === 'detail') {
    traits.push("Moderate Conscientiousness: Flexible approach, big-picture focused")
  }

  // Agreeableness
  if (answers.naturalStrength === 'emotional' || answers.teamRole === 'mediator') {
    traits.push("High Agreeableness: Empathetic, collaborative, people-focused")
  } else if (answers.avoidActivity === 'conflict') {
    traits.push("Moderate to High Agreeableness: Harmony-seeking, diplomatic")
  }

  // Stress Tolerance
  if (answers.stressCoping === 'thrive') {
    traits.push("High Stress Tolerance: Performs well under pressure")
  } else if (answers.stressCoping === 'struggle') {
    traits.push("Lower Stress Tolerance: Needs supportive, low-pressure environment")
  }

  return traits.join("\n")
}