import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, Brain, Target, Lightbulb, Star, Loader2, Trash2 } from 'lucide-react'
import { analyzeTests } from '../services/openRouter'
import LoadingAnimation from './LoadingAnimation'

const testTypes = {
  big5: {
    name: 'Big 5 Personality',
    description: 'Measures openness, conscientiousness, extraversion, agreeableness, and neuroticism',
    icon: Brain,
    color: 'from-blue-500 to-blue-600'
  },
  multipleIntelligence: {
    name: 'Multiple Intelligence',
    description: 'Gardner\'s theory of eight different types of intelligence',
    icon: Lightbulb,
    color: 'from-green-500 to-green-600'
  },
  riasec: {
    name: 'RIASEC Career Test',
    description: 'Realistic, Investigative, Artistic, Social, Enterprising, Conventional',
    icon: Target,
    color: 'from-purple-500 to-purple-600'
  },
  cliftonStrengths: {
    name: 'CliftonStrengths 34',
    description: 'Gallup\'s assessment of your top talent themes',
    icon: Star,
    color: 'from-orange-500 to-orange-600'
  }
}

const TestCard = ({ testType, testInfo, uploadedFile, onUpload, isAnalyzing }) => {
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
        reader.readAsText(file)
      }
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    disabled: isAnalyzing
  })

  return (
    <div className={`card p-6 transition-all duration-200 ${isDragActive ? 'ring-2 ring-primary-300 ring-offset-2' : ''} ${uploadedFile ? 'bg-green-50/50 border-green-200' : ''}`}>
      <div className="flex items-start space-x-4 mb-4">
        <div className={`bg-gradient-to-r ${testInfo.color} p-3 rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{testInfo.name}</h3>
          <p className="text-sm text-gray-600">{testInfo.description}</p>
        </div>
        {uploadedFile && (
          <CheckCircle className="w-6 h-6 text-green-500" />
        )}
      </div>

      {uploadedFile ? (
        <div className="bg-white/60 rounded-xl p-4 border border-green-200 relative">
          <button
            onClick={() => onUpload(testType, null, null)}
            className="absolute top-2 right-2 p-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
            title="Delete and reupload"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
          <div className="flex items-center space-x-2 pr-8">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 truncate">{uploadedFile.file.name}</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Size: {(uploadedFile.file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragActive 
              ? 'border-primary-400 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? 'text-primary-500' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 mb-1">
            Drop your {testInfo.name.toLowerCase()} results here
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF, TXT, or image files
          </p>
        </div>
      )}
    </div>
  )
}

const TestUpload = ({ uploadedTests, onTestUpload, onAnalyze, isAnalyzing, onRecommendations }) => {
  const [error, setError] = useState(null)
  const hasAnyTests = Object.values(uploadedTests).some(test => test !== null)

  const handleAnalyze = async () => {
    if (!hasAnyTests) return
    
    setError(null)
    onAnalyze()
    try {
      const results = await analyzeTests(uploadedTests)
      onRecommendations(results)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error.message || 'Failed to analyze tests. Please try again.')
      onRecommendations(null)
    }
  }

  return (
    <div className="animate-slide-up">
      {/* Test Upload Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {Object.entries(testTypes).map(([key, testInfo]) => (
          <TestCard
            key={key}
            testType={key}
            testInfo={testInfo}
            uploadedFile={uploadedTests[key]}
            onUpload={onTestUpload}
            isAnalyzing={isAnalyzing}
          />
        ))}
      </div>

      {/* Analyze Button */}
      {hasAnyTests && (
        <div className="text-center">
          {isAnalyzing ? (
            <LoadingAnimation message="Analyzing your personality tests..." />
          ) : (
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              <Brain className="w-5 h-5" />
              <span>Get My Recommendations</span>
            </button>
          )}
          
          {!isAnalyzing && !error && (
            <p className="text-sm text-gray-500 mt-3">
              Our AI will analyze your personality tests and provide personalized career recommendations
            </p>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4 max-w-md mx-auto">
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
  )
}

export default TestUpload 