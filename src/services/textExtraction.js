import axios from 'axios'

const EXTRACTION_MODEL = 'deepseek-chat'

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DeepSeek API key is not configured. Please set VITE_DEEPSEEK_API_KEY environment variable in your deployment platform.')
  }
  return apiKey
}

const createExtractionClient = () => {
  return axios.create({
    baseURL: 'https://api.deepseek.com',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json'
    }
  })
}

// Extract text from different file types
export const extractTextFromFile = async (file, content, testType) => {
  try {
    // If it's already text, return as-is
    if (!content.startsWith('data:')) {
      return content
    }

    // For images and PDFs, extract text
    const extractionPrompt = createExtractionPrompt(testType)
    
    const extractionClient = createExtractionClient()
    const response = await extractionClient.post('/chat/completions', {
      model: EXTRACTION_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: extractionPrompt },
            { type: 'image_url', image_url: { url: content } }
          ]
        }
      ],
      temperature: 0.1, // Low temperature for accurate extraction
      max_tokens: 2000
    })

    return response.data.choices[0].message.content
  } catch (error) {
    console.error('Text extraction failed:', error.response?.data || error)
    throw new Error(`Failed to extract text from ${testType} file`)
  }
}

// Create extraction prompt based on test type
const createExtractionPrompt = (testType) => {
  const prompts = {
    big5: `Extract all text from this Big 5 Personality Test results image. Focus on:
- All personality dimension scores/percentiles
- Any numerical values or percentages
- Descriptive text about each dimension
- Overall summary or interpretation

Format the output as clean, readable text preserving all important information.`,

    multipleIntelligence: `Extract all text from this Multiple Intelligence Test results image. Focus on:
- Intelligence type names and scores
- Percentages or rankings
- Any descriptions or explanations
- Overall results summary

Format the output as clean, readable text preserving all important information.`,

    riasec: `Extract all text from this RIASEC Career Interest Test results image. Focus on:
- All six interest area names (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
- Scores, percentages, or rankings for each area
- Any descriptions or interpretations
- Overall results summary

Format the output as clean, readable text preserving all important information.`,

    cliftonStrengths: `Extract all text from this CliftonStrengths/Gallup test results image. Focus on:
- All 34 strength names in order (or top strengths shown)
- Rankings or positions (1-34)
- Any descriptions or explanations
- Overall results summary

Format the output as clean, readable text preserving all important information.`
  }

  return prompts[testType] || `Extract all text from this personality test results image. Preserve all scores, rankings, and descriptions. Format as clean, readable text.`
}

// Parse extracted text into structured format
export const parseExtractedText = (extractedTexts) => {
  const structuredData = {
    big5: null,
    multipleIntelligence: null,
    riasec: null,
    cliftonStrengths: null
  }

  Object.entries(extractedTexts).forEach(([testType, text]) => {
    if (text && text.trim()) {
      structuredData[testType] = {
        rawText: text,
        structured: parseTestSpecificData(testType, text)
      }
    }
  })

  return structuredData
}

// Parse test-specific data (can be enhanced with regex patterns)
const parseTestSpecificData = (testType, text) => {
  // Basic parsing - can be enhanced with more sophisticated regex patterns
  const data = {
    testType,
    extractedAt: new Date().toISOString(),
    keyFindings: extractKeyFindings(testType, text)
  }

  // Add test-specific parsing logic here
  switch (testType) {
    case 'big5':
      data.dimensions = extractBig5Dimensions(text)
      break
    case 'riasec':
      data.interests = extractRiasecInterests(text)
      break
    case 'cliftonStrengths':
      data.strengths = extractStrengths(text)
      break
    case 'multipleIntelligence':
      data.intelligences = extractIntelligences(text)
      break
  }

  return data
}

// Extract key findings from text (simple implementation)
const extractKeyFindings = (testType, text) => {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.slice(0, 10) // Return first 10 non-empty lines as key findings
}

// Placeholder functions for specific test parsing (can be enhanced)
const extractBig5Dimensions = (text) => {
  // Look for patterns like "Extraversion: 93rd percentile"
  const dimensions = {}
  const patterns = [
    /extraversion:?\s*(\d+)/i,
    /conscientiousness:?\s*(\d+)/i,
    /openness:?\s*(\d+)/i,
    /agreeableness:?\s*(\d+)/i,
    /neuroticism:?\s*(\d+)/i
  ]
  // Basic implementation - can be enhanced
  return dimensions
}

const extractRiasecInterests = (text) => {
  // Look for RIASEC interest areas and scores
  return {}
}

const extractStrengths = (text) => {
  // Extract CliftonStrengths in order
  return []
}

const extractIntelligences = (text) => {
  // Extract multiple intelligence scores
  return {}
}