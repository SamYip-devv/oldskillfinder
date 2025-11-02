import axios from 'axios'

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DeepSeek API key is not configured. Please set VITE_DEEPSEEK_API_KEY environment variable in your deployment platform.')
  }
  return apiKey
}

const createDeepseekClient = () => {
  return axios.create({
    baseURL: 'https://api.deepseek.com',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json'
    }
  })
}

export const generatePersonalizedLearningMap = async (skill, userProfile, personalityData) => {
  const prompt = `You are an expert career coach and learning path designer. Based on the user's personality profile and their selected skill, create a comprehensive, personalized learning roadmap.

USER'S PERSONALITY PROFILE:
${userProfile}

PERSONALITY TEST DATA:
${JSON.stringify(personalityData, null, 2)}

SELECTED SKILL TO LEARN: ${skill.name}
SKILL DESCRIPTION: ${skill.description}
PERSONALITY ALIGNMENT: ${skill.personalityAlignment || 'Not specified'}

Create a detailed, personalized learning map for this specific person learning ${skill.name}. The map should be tailored to their personality traits, learning style, and strengths.

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "skillName": "${skill.name}",
  "personalizedApproach": "Brief explanation of how this learning path is customized for their personality",
  "estimatedDuration": "Total estimated time to proficiency",
  "phases": [
    {
      "title": "Phase name",
      "duration": "Estimated duration",
      "focus": "What this phase focuses on",
      "personalityNote": "How this phase aligns with their personality",
      "color": "from-blue-500 to-blue-600",
      "steps": [
        {
          "id": "unique_id",
          "title": "Step title",
          "description": "Detailed description of what to do",
          "personalizedTip": "Specific tip based on their personality",
          "difficulty": "Beginner/Intermediate/Advanced",
          "resources": ["Specific resource 1", "Specific resource 2"],
          "timeEstimate": "2-3 hours"
        }
      ]
    }
  ],
  "milestones": [
    {
      "metric": "projects",
      "value": 3,
      "reward": "Built first portfolio",
      "description": "What this milestone represents"
    }
  ],
  "personalityBasedTips": [
    "Tip 1 based on their specific traits",
    "Tip 2 based on their learning style"
  ],
  "potentialChallenges": [
    {
      "challenge": "Specific challenge they might face",
      "solution": "Personalized solution based on their strengths"
    }
  ]
}

Guidelines:
1. Make the learning path HIGHLY SPECIFIC to ${skill.name} - include actual tools, platforms, and resources
2. Customize every phase based on their personality traits (introvert/extrovert, analytical/creative, etc.)
3. Include 3-4 phases with 3-4 steps each
4. Make milestones realistic and measurable
5. Use varied colors for phases: blue (from-blue-500 to-blue-600), green (from-green-500 to-green-600), purple (from-purple-500 to-purple-600), etc.
6. Provide specific, actionable resources (actual course names, websites, books)
7. Address their unique learning style and potential obstacles
8. Make time estimates realistic
9. Ensure the path progresses from beginner to advanced naturally

Do not include any text outside the JSON structure.`

  try {
    const deepseekClient = createDeepseekClient()
    const response = await deepseekClient.post('/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
    
    let responseText = response.data.choices[0].message.content
    
    // Clean the response - remove markdown code blocks if present
    responseText = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '')
    responseText = responseText.replace(/^```\s*/i, '').replace(/\s*```$/i, '')
    responseText = responseText.trim()
    
    // Try to extract JSON if it's embedded in text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      responseText = jsonMatch[0]
    }
    
    // Parse and validate the response
    let learningMap
    try {
      learningMap = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse JSON:', responseText)
      throw new Error('Failed to parse learning map data. Please try again.')
    }
    
    // Add any missing fields with defaults
    if (!learningMap.phases) learningMap.phases = []
    if (!learningMap.milestones) learningMap.milestones = []
    if (!learningMap.personalityBasedTips) learningMap.personalityBasedTips = []
    if (!learningMap.potentialChallenges) learningMap.potentialChallenges = []
    
    // Ensure each phase has required fields
    learningMap.phases = learningMap.phases.map((phase, index) => ({
      ...phase,
      color: phase.color || getPhaseColor(index),
      steps: (phase.steps || []).map((step, stepIndex) => ({
        ...step,
        id: step.id || `${learningMap.skillName.toLowerCase().replace(/\s+/g, '')}_${index}_${stepIndex}`,
        difficulty: step.difficulty || 'Intermediate',
        resources: step.resources || [],
        timeEstimate: step.timeEstimate || '1-2 hours'
      }))
    }))
    
    return learningMap
  } catch (error) {
    console.error('Failed to generate learning map:', error)
    
    // Return a basic fallback structure
    return {
      skillName: skill.name,
      personalizedApproach: "We'll create a learning path tailored to your unique strengths and personality.",
      estimatedDuration: "3-6 months",
      phases: [
        {
          title: "Foundation Building",
          duration: "4-6 weeks",
          focus: "Core concepts and fundamentals",
          personalityNote: "Adapted to your learning style",
          color: "from-blue-500 to-blue-600",
          steps: [
            {
              id: "foundation_1",
              title: "Start with basics",
              description: "Begin your journey with fundamental concepts",
              personalizedTip: "Take your time to build a strong foundation",
              difficulty: "Beginner",
              resources: ["Online tutorials", "Introductory courses"],
              timeEstimate: "2-3 hours"
            }
          ]
        }
      ],
      milestones: [
        {
          metric: "completion",
          value: 25,
          reward: "Foundation Complete",
          description: "You've mastered the basics"
        }
      ],
      personalityBasedTips: [
        "Learn at your own pace",
        "Focus on practical application"
      ],
      potentialChallenges: [
        {
          challenge: "Initial learning curve",
          solution: "Break down complex topics into smaller parts"
        }
      ]
    }
  }
}

const getPhaseColor = (index) => {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-purple-500 to-purple-600",
    "from-indigo-500 to-indigo-600",
    "from-pink-500 to-pink-600",
    "from-orange-500 to-orange-600"
  ]
  return colors[index % colors.length]
}