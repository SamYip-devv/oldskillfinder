import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Upload, FileText, CheckCircle, Brain, Target, Lightbulb, Star, X, Trash2, GraduationCap, Plus, ExternalLink } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import LoadingAnimation from './LoadingAnimation'
import { analyzeTests } from '../services/openRouter'

const testTypes = {
  big5: {
    name: 'Big 5 Personality Test',
    shortName: 'Big 5',
    description: 'Measures your five core personality dimensions: openness, conscientiousness, extraversion, agreeableness, and neuroticism.',
    testUrl: 'https://www.personalityassessor.com/ipip-300/',
    icon: Brain,
    color: 'from-blue-500 to-blue-600',
    step: 1
  },
  multipleIntelligence: {
    name: 'Multiple Intelligence Test',
    shortName: 'Multiple Intelligence',
    description: 'Discover your unique intelligence profile across eight different types of intelligence according to Gardner\'s theory.',
    testUrl: 'https://www.idrlabs.com/multiple-intelligences/test.php',
    icon: Lightbulb,
    color: 'from-green-500 to-green-600',
    step: 2
  },
  riasec: {
    name: 'RIASEC Career Interest Test',
    shortName: 'RIASEC',
    description: 'Explore your career interests across six key areas: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.',
    testUrl: 'https://www.truity.com/test/holland-code-career-test',
    icon: Target,
    color: 'from-purple-500 to-purple-600',
    step: 3
  },
  cliftonStrengths: {
    name: 'CliftonStrengths 34 Assessment',
    shortName: 'CliftonStrengths',
    description: 'Identify your top talent themes from Gallup\'s comprehensive assessment of human strengths.',
    testUrl: 'https://commerce.gallup.com/product/cliftonstrengths-34/01tPa00000QhS6zIAF',
    icon: Star,
    color: 'from-orange-500 to-orange-600',
    step: 4
  }
}

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center mb-4 sm:mb-8 px-2 sm:px-4">
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto max-w-full">
        {Array.from({ length: totalSteps }, (_, i) => (
          <React.Fragment key={i}>
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 flex-shrink-0 ${
              i + 1 < currentStep 
                ? 'bg-green-500 text-white' 
                : i + 1 === currentStep 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {i + 1 < currentStep ? '✓' : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-4 sm:w-8 h-1 rounded transition-all duration-300 ${
                i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

const TestStepCard = ({ testType, testInfo, uploadedFile, onUpload, isAnalyzing, extractionStatus }) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const Icon = testInfo.icon

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          onUpload(testType, file, e.target.result)
        }
        
        // Handle different file types appropriately
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file)
        } else if (file.type === 'application/pdf') {
          reader.readAsDataURL(file)
        } else {
          reader.readAsText(file)
        }
      }
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    disabled: isAnalyzing
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className={`bg-gradient-to-r ${testInfo.color} p-4 rounded-2xl inline-block mb-4`}>
          <Icon className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{testInfo.name}</h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto mb-4">
          {testInfo.description}
        </p>
        {testInfo.testUrl && (
          <div className="max-w-lg mx-auto">
            <a 
              href={testInfo.testUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium hover:underline"
            >
              <span>You can take the test here</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {uploadedFile && uploadedFile.file ? (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center relative">
          <button
            onClick={() => onUpload(testType, null, null)}
            className="absolute top-4 right-4 p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
            title="Delete and reupload"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Test Uploaded Successfully!</h3>
          <div className="bg-white rounded-xl p-4 border border-green-200 inline-block">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">{uploadedFile.file.name}</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Size: {(uploadedFile.file.size / 1024).toFixed(1)} KB
            </p>
            {extractionStatus && (
              <div className="mt-2 text-xs">
                {extractionStatus === 'extracting' && (
                  <span className="text-blue-600">🔄 Extracting text...</span>
                )}
                {extractionStatus === 'completed' && (
                  <span className="text-green-600">✅ Text extraction complete</span>
                )}
                {extractionStatus === 'failed' && (
                  <span className="text-orange-600">⚠️ Using original content</span>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Wrong file? Click the trash icon to upload a different one.
          </p>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50 shadow-lg' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Upload Your {testInfo.shortName} Results
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your test results here, or click to browse
          </p>
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <span>Supports PDF, TXT, or image files</span>
          </div>
        </div>
      )}
    </div>
  )
}

const StepWizard = ({ onRecommendations, onReset }) => {
  // Default initial state
  const savedState = {
    currentStep: 1,
    uploadedTests: {
      big5: null,
      multipleIntelligence: null,
      riasec: null,
      cliftonStrengths: null
    },
    userDescription: '',
    undergraduateDegree: '',
    considerDegree: true
  }
  const [currentStep, setCurrentStep] = useState(savedState.currentStep)
  const [uploadedTests, setUploadedTests] = useState(savedState.uploadedTests)
  const [extractedTexts, setExtractedTexts] = useState({})
  const [extractionProgress, setExtractionProgress] = useState({})
  const [userDescription, setUserDescription] = useState(savedState.userDescription)
  const [undergraduateDegree, setUndergraduateDegree] = useState(savedState.undergraduateDegree)
  const [majorSatisfaction, setMajorSatisfaction] = useState(savedState.majorSatisfaction || 3) // 1-5 scale, 3 is neutral
  const [considerDegree, setConsiderDegree] = useState(savedState.considerDegree !== undefined ? savedState.considerDegree : true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStage, setAnalysisStage] = useState('preparing')
  const [error, setError] = useState(null)

  const totalSteps = 7 // 4 test steps + 1 degree step + 1 description step + 1 analysis step

  const hasAnyTests = Object.values(uploadedTests).some(test => test && test.file !== null)

  const handleTestUpload = async (testType, file, content) => {
    // Update uploaded tests first
    setUploadedTests(prev => ({
      ...prev,
      [testType]: { file, content }
    }))

    // If file is null (deletion), remove from extracted texts
    if (!file || !content) {
      setExtractedTexts(prev => ({
        ...prev,
        [testType]: null
      }))
      setExtractionProgress(prev => ({
        ...prev,
        [testType]: null
      }))
      return
    }

    // Start text extraction for images/PDFs immediately
    if (content.startsWith('data:image/') || content.startsWith('data:application/pdf')) {
      setExtractionProgress(prev => ({
        ...prev,
        [testType]: 'extracting'
      }))

      try {
        const { extractTextFromFile } = await import('../services/textExtraction.js')
        const extractedText = await extractTextFromFile(file, content, testType)
        
        setExtractedTexts(prev => ({
          ...prev,
          [testType]: extractedText
        }))
        
        setExtractionProgress(prev => ({
          ...prev,
          [testType]: 'completed'
        }))
      } catch (error) {
        console.warn(`Failed to extract text from ${testType}:`, error)
        setExtractedTexts(prev => ({
          ...prev,
          [testType]: content // Fall back to original content
        }))
        
        setExtractionProgress(prev => ({
          ...prev,
          [testType]: 'failed'
        }))
      }
    } else {
      // For text files, use content directly
      setExtractedTexts(prev => ({
        ...prev,
        [testType]: content
      }))
      
      setExtractionProgress(prev => ({
        ...prev,
        [testType]: 'completed'
      }))
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAnalyze = async () => {
    if (!hasAnyTests) return
    
    setError(null)
    setIsAnalyzing(true)
    setAnalysisStage('processing')
    
    try {
      // Use pre-extracted texts for faster analysis
      const { parseExtractedText } = await import('../services/textExtraction.js')
      const { generateComprehensiveAnalysis } = await import('../services/comprehensiveAnalysis.js')
      
      setAnalysisStage('analyzing')
      
      // Prepare extracted texts - use pre-extracted if available, otherwise use original content
      const finalExtractedTexts = {}
      Object.entries(uploadedTests).forEach(([testType, testData]) => {
        if (testData && testData.content) {
          finalExtractedTexts[testType] = extractedTexts[testType] || testData.content
        }
      })
      
      // Parse extracted text into structured format
      const structuredData = parseExtractedText(finalExtractedTexts)
      
      // Generate comprehensive analysis
      const degreeWithSatisfaction = considerDegree && undergraduateDegree 
        ? `${undergraduateDegree} [SATISFACTION_LEVEL: ${majorSatisfaction}]`
        : ''
      
      const results = await generateComprehensiveAnalysis(
        structuredData,
        userDescription,
        degreeWithSatisfaction
      )
      
      onRecommendations(results)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error.message || 'Failed to analyze tests. Please try again.')
    } finally {
      setIsAnalyzing(false)
      setAnalysisStage('preparing')
    }
  }

  const getCurrentTestType = () => {
    const testKeys = Object.keys(testTypes)
    return testKeys[currentStep - 1]
  }

  const getCurrentTestInfo = () => {
    const testType = getCurrentTestType()
    return testTypes[testType]
  }

  if (currentStep === 5) {
    // Undergraduate degree step
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-2xl inline-block mb-4">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Current Undergraduate Degree</h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
                Tell us about your current field of study. We'll help you build on these skills while exploring new ones.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {/* Toggle for degree consideration */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Include my major in skill recommendations?</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {considerDegree 
                        ? "Skills will complement your current studies" 
                        : "Skills based only on your personality"}
                    </p>
                  </div>
                  <button
                    onClick={() => setConsiderDegree(!considerDegree)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      considerDegree ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={considerDegree}
                  >
                    <span className="sr-only">Consider degree in recommendations</span>
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                        considerDegree ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              <div className={`transition-opacity ${considerDegree ? 'opacity-100' : 'opacity-40'}`}>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  What are you currently studying?
                </label>
                <input
                  type="text"
                  value={undergraduateDegree}
                  onChange={(e) => setUndergraduateDegree(e.target.value)}
                  placeholder="E.g., Computer Science, Business Administration, Psychology, Engineering..."
                  disabled={!considerDegree}
                  className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-colors ${
                    considerDegree 
                      ? 'border-gray-200 focus:border-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-2">
                  We'll suggest skills that complement your current studies
                </p>
                
                {/* Major Satisfaction Level */}
                <div className="mt-6 space-y-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    How do you feel about your major?
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={majorSatisfaction}
                      onChange={(e) => setMajorSatisfaction(parseInt(e.target.value))}
                      disabled={!considerDegree}
                      className={`w-full h-2 rounded-lg appearance-none ${
                        considerDegree ? 'cursor-pointer' : 'cursor-not-allowed'
                      }`}
                      style={{
                        background: considerDegree
                          ? `linear-gradient(to right, 
                            ${majorSatisfaction === 1 ? '#ef4444' : '#e5e7eb'} 0%, 
                            ${majorSatisfaction >= 2 ? '#f59e0b' : '#e5e7eb'} 25%, 
                            ${majorSatisfaction >= 3 ? '#eab308' : '#e5e7eb'} 50%, 
                            ${majorSatisfaction >= 4 ? '#84cc16' : '#e5e7eb'} 75%, 
                            ${majorSatisfaction === 5 ? '#10b981' : '#e5e7eb'} 100%)`
                          : '#e5e7eb'
                      }}
                    />
                    <div className="flex items-center justify-center space-x-3 mt-4">
                      <span className="text-3xl">
                        {majorSatisfaction === 1 && "😟"}
                        {majorSatisfaction === 2 && "😕"}
                        {majorSatisfaction === 3 && "😐"}
                        {majorSatisfaction === 4 && "😊"}
                        {majorSatisfaction === 5 && "😍"}
                      </span>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        !considerDegree ? 'bg-gray-100 text-gray-400' :
                        majorSatisfaction === 1 ? 'bg-red-100 text-red-700' :
                        majorSatisfaction === 2 ? 'bg-orange-100 text-orange-700' :
                        majorSatisfaction === 3 ? 'bg-yellow-100 text-yellow-700' :
                        majorSatisfaction === 4 ? 'bg-lime-100 text-lime-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {majorSatisfaction === 1 && "I really dislike it"}
                        {majorSatisfaction === 2 && "Not very happy"}
                        {majorSatisfaction === 3 && "It's okay"}
                        {majorSatisfaction === 4 && "I like it"}
                        {majorSatisfaction === 5 && "I love it!"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Why we ask:</strong> Your current degree represents 3-4 years of learning. We want to help you build additional skills that complement your existing knowledge, not replace it.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-3 sm:space-x-4 mt-8">
              <button 
                onClick={handlePrevious}
                className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>Previous</span>
              </button>
              
              <button 
                onClick={handleNext}
                className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 6) {
    // User description step
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl inline-block mb-4">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
                Help us personalize your recommendations by sharing a bit about yourself, your goals, or any specific concerns.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Tell us about your interests, goals, or concerns (optional):
              </label>
              
              <textarea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Share anything that might help us personalize your recommendations - your interests, career goals, concerns about the job market, work-life balance preferences, or anything else you'd like us to consider..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-vertical min-h-[120px]"
                maxLength={300}
              />
              <p className="text-sm text-gray-500 mt-2">
                {userDescription.length}/300 characters • This helps us personalize your recommendations
              </p>
            </div>

            <div className="flex justify-center space-x-3 sm:space-x-4 mt-8">
              <button 
                onClick={handlePrevious}
                className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>Previous</span>
              </button>
              
              <button 
                onClick={handleNext}
                className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                <span>Continue to Analysis</span>
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 7) {
    // Analysis step
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          
          {isAnalyzing ? (
            <LoadingAnimation 
              message={
                analysisStage === 'processing' ? "Processing and structuring your data..." :
                analysisStage === 'analyzing' ? "Generating comprehensive career analysis..." :
                "Analyzing your personality profile..."
              }
              stage={analysisStage}
            />
          ) : (
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl inline-block mb-8">
                <Brain className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready for Your Analysis!</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                We've collected your personality test results. Now let our AI create a comprehensive analysis with personalized career recommendations and skill development paths.
              </p>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile Summary:</h3>
                <div className="space-y-3">
                  {Object.entries(uploadedTests).map(([key, test]) => (
                    test && test.file && (
                      <div key={key} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700 font-medium">{testTypes[key].name}</span>
                      </div>
                    )
                  ))}
                  {undergraduateDegree && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-blue-500" />
                      <span className="text-blue-700 font-medium">
                        Studying: {undergraduateDegree} 
                        <span className={`ml-2 text-sm ${
                          majorSatisfaction <= 2 ? 'text-red-600' : 
                          majorSatisfaction === 3 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          ({majorSatisfaction === 1 ? "Hate it" : 
                            majorSatisfaction === 2 ? "Don't like it" :
                            majorSatisfaction === 3 ? "It's okay" :
                            majorSatisfaction === 4 ? "Like it" :
                            "Love it!"})
                        </span>
                      </span>
                    </div>
                  )}
                  {userDescription && (
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <span className="text-purple-700 font-medium">Personal insights provided</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center space-x-3 sm:space-x-4">
                <button 
                  onClick={handlePrevious}
                  className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span>Previous</span>
                </button>
                
                <button 
                  onClick={handleAnalyze}
                  disabled={!hasAnyTests}
                  className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  <Brain className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span>Analyze My Profile</span>
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6 max-w-md mx-auto">
                  <p className="text-red-700 text-sm font-medium">❌ {error}</p>
                  <button 
                    onClick={handleAnalyze}
                    className="text-red-600 hover:text-red-800 text-sm underline mt-2"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-8">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        <TestStepCard
          testType={getCurrentTestType()}
          testInfo={getCurrentTestInfo()}
          uploadedFile={uploadedTests[getCurrentTestType()]}
          onUpload={handleTestUpload}
          isAnalyzing={isAnalyzing}
          extractionStatus={extractionProgress[getCurrentTestType()]}
        />

        <div className="flex justify-center space-x-3 sm:space-x-4 mt-8 sm:mt-12">
          {currentStep === 1 ? (
            <button 
              onClick={onReset}
              className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Go Back</span>
            </button>
          ) : currentStep > 1 && (
            <button 
              onClick={handlePrevious}
              className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Previous</span>
            </button>
          )}
          
          <button 
            onClick={handleNext}
            className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base"
          >
            <span>{currentStep === 4 ? 'Add Description' : 'Next'}</span>
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StepWizard