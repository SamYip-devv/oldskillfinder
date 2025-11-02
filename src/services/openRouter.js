import axios from 'axios'

const MODEL_NAME = 'deepseek-chat'

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DeepSeek API key is not configured. Please set VITE_DEEPSEEK_API_KEY environment variable.')
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

const createAnalysisPrompt = (uploadedTests, userDescription = '', undergraduateDegree = '') => {
  let prompt = `You are an expert skills development coach specializing in helping undergraduate students build complementary skills alongside their academic studies. You understand that students have already invested 3-4 years in their current degree and want to enhance their opportunities without completely changing direction.

Your role is to analyze personality test results and suggest practical, actionable skills that complement their existing education and open up diverse opportunities.

Here's the student's profile:

`

  // Add test results to prompt
  Object.entries(uploadedTests).forEach(([testType, testData]) => {
    if (testData && testData.content) {
      const testNames = {
        big5: 'Big 5 Personality Test',
        multipleIntelligence: 'Gardner Multiple Intelligence Test',
        riasec: 'RIASEC Career Interest Test',
        cliftonStrengths: 'Gallup CliftonStrengths 34'
      }
      
      // Handle different content types
      let contentDescription = testData.content
      if (testData.content.startsWith('data:image/')) {
        contentDescription = `[IMAGE DATA: ${testNames[testType]} results provided as image. Please analyze the personality test results shown in this image.]\n${testData.content}`
      } else if (testData.content.startsWith('data:application/pdf')) {
        contentDescription = `[PDF DATA: ${testNames[testType]} results provided as PDF document. Please analyze the personality test results in this PDF.]\n${testData.content}`
      }
      
      prompt += `\n## ${testNames[testType]} Results:\n${contentDescription}\n`
    }
  })

  // Add undergraduate degree
  if (undergraduateDegree && undergraduateDegree.trim()) {
    prompt += `\n## Current Undergraduate Degree:\n${undergraduateDegree}\n\nIMPORTANT: This student has been studying ${undergraduateDegree} for several years. IF they selected to consider their degree, suggest skills that complement and enhance their existing knowledge. IF they chose NOT to consider their degree, focus purely on personality-based recommendations.\n`
  }

  // Add user description if provided
  if (userDescription && userDescription.trim()) {
    prompt += `\n## Student's Interests/Concerns:\n${userDescription}\n\nNote: Use this as supplementary information only. Base recommendations primarily on personality test results, not on this self-description.\n`
  }

  prompt += `

CRITICAL: Check if the student wants their degree considered or not. If they chose NOT to consider their degree, base recommendations ONLY on personality tests.

Based on this profile, provide skill development recommendations in the following JSON format:

{
  "primarySkills": [
    {
      "name": "Skill Direction (e.g., Web Development, Data Analytics, Digital Marketing)",
      "description": "Brief description of this skill path",
      "match": 90,
      "personalityAlignment": "Specific explanation of how this skill aligns with their Big 5, RIASEC, strengths, etc."
    }
  ],
  "skills": [
    {
      "name": "Skill Name",
      "description": "Why this skill is important for this person",
      "match": 90,
      "category": "technical/creative/analytical/design",
      "personalityTraits": "Which specific personality traits make this skill a good fit"
    }
  ],
  "additionalSkills": [
    {
      "name": "Programming",
      "description": "Specific programming languages or technologies suited to their personality",
      "match": 85,
      "reasoning": "Combined analysis of why this fits their cognitive style and how their specific test results (e.g., high openness, investigative type) make them suited for this"
    },
    {
      "name": "Creative Writing",
      "description": "Types of writing that match their personality traits",
      "match": 80,
      "reasoning": "Analysis of their creative expression potential and how their personality profile supports this skill"
    },
    {
      "name": "Baking/Culinary Arts",
      "description": "How culinary skills align with their personality",
      "match": 75,
      "reasoning": "Connection to their detail orientation, creativity, and which specific personality traits make them suited for culinary arts"
    },
    {
      "name": "Content Creation/Vlogging",
      "description": "Video content creation and social media presence",
      "match": 88,
      "reasoning": "Analysis of their communication style, audience connection, and how their extraversion, openness, or other traits support content creation"
    }
  ],
  "careerPaths": [
    {
      "name": "Career Path Name",
      "description": "Brief description of this career direction and its opportunities",
      "match": 88,
      "personalityAlignment": "How this career aligns with their specific personality test results",
      "skillsNeeded": "Key skills they should focus on for this career path"
    }
  ],
  "skillsToAvoid": [
    {
      "name": "Skill or Career to Avoid",
      "reason": "Detailed explanation based on personality traits why this wouldn't be a good fit",
      "personalityMismatch": "Specific personality traits that conflict with this path"
    }
  ],
  "education": [
    {
      "name": "Educational Path",
      "description": "Recommended educational direction",
      "match": 80
    }
  ],
  "workEnvironment": [
    {
      "name": "Environment Type",
      "description": "Why this work environment suits this person"
    }
  ],
  "insights": "A comprehensive paragraph explaining the key insights from the personality analysis and how they connect to career success.",
  "nextSteps": [
    "Specific actionable step 1",
    "Specific actionable step 2",
    "Specific actionable step 3"
  ]
}

Important guidelines:
- Focus on DIRECTIONAL SKILLS - not too specific, but clear paths (e.g., "Web Development" not just "HTML", "Data Analytics" not just "Excel")
- Provide ONLY 3-5 primary skills total to avoid overwhelming students
- Provide ONLY 2-3 additional skill directions
- Provide 3-4 career paths that align with their personality and skills
- COMBINE primary and additional skills reasoning into single, comprehensive explanations
- ALWAYS include match percentages (70-95%) for ALL skills and career paths
- Include 2-3 skills/careers to AVOID based on personality mismatches
- Skills should be learnable directions, not overly technical specifics
- Explain HOW each skill enhances their existing education
- For EVERY skill, provide SPECIFIC connections to their personality test results:
  * Reference their Big 5 traits (e.g., "Your high openness score of X makes you naturally curious about...")
  * Connect to their RIASEC type (e.g., "As an Investigative-Artistic type, you'll excel at...")
  * Mention their top strengths (e.g., "Your Learner strength means you'll enjoy mastering...")
  * Use their multiple intelligences (e.g., "Your spatial intelligence supports...")
- Make personality connections concrete and specific, not generic
- DO NOT rely heavily on user's self-description - it's just supplementary
- Base recommendations primarily on objective test results
- Suggest practical projects to develop these skills
- Consider their personality traits when recommending learning approaches
- Focus on skills that open multiple opportunities
- Emphasize transferable skills that work across industries
- Include both technical and soft skills
- Suggest online resources, communities, and practical ways to learn
- Consider skills that can be monetized during college (freelancing, tutoring, etc.)
- Address the modern job market where hybrid skills are valuable
- Remember: They're NOT changing majors, they're ADDING to their toolkit

CRITICAL: You MUST respond with ONLY a valid JSON object. Do not include any markdown formatting, explanatory text, or anything else. Start your response with { and end with }. No other text before or after the JSON.`

  return prompt
}

export const analyzeTests = async (uploadedTests, userDescription = '', undergraduateDegree = '') => {
  try {
    // Import the new services
    const { extractTextFromFile, parseExtractedText } = await import('./textExtraction.js')
    const { generateComprehensiveAnalysis } = await import('./comprehensiveAnalysis.js')
    
    // Step 1: Extract text from all files
    const extractedTexts = {}
    
    for (const [testType, testData] of Object.entries(uploadedTests)) {
      if (testData && testData.content) {
        try {
          extractedTexts[testType] = await extractTextFromFile(
            testData.file,
            testData.content,
            testType
          )
        } catch (extractionError) {
          console.warn(`Failed to extract text from ${testType}:`, extractionError)
          // Fall back to original content if extraction fails
          extractedTexts[testType] = testData.content
        }
      }
    }
    
    // Step 2: Parse extracted text into structured format
    const structuredData = parseExtractedText(extractedTexts)
    
    // Step 3: Generate comprehensive analysis
    const analysis = await generateComprehensiveAnalysis(
      structuredData,
      userDescription,
      undergraduateDegree
    )
    
    return analysis
  } catch (error) {
    console.error('Analysis error:', error)
    
    if (error.response) {
      // API responded with error status
      throw new Error(`API Error: ${error.response.status}. Please check your internet connection and try again.`)
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your internet connection and try again.')
    } else {
      // Other error
      throw new Error(error.message || 'Failed to analyze tests. Please try again.')
    }
  }
} 