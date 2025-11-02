import React, { useState, useEffect } from 'react'
import {
  Compass,
  Brain,
  Sparkles,
  TrendingUp,
  Zap,
  BookOpen,
  Target,
  Users,
  Lightbulb,
  Activity
} from 'lucide-react'

const analysisSteps = [
  {
    id: 'reading',
    name: 'Reading your personality data',
    icon: BookOpen,
    duration: 2000,
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'analyzing',
    name: 'Analyzing your unique traits',
    icon: Brain,
    duration: 3000,
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 'matching',
    name: 'Matching with career paths',
    icon: Target,
    duration: 2500,
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'ilp',
    name: 'Finding ILP recommendations',
    icon: Users,
    duration: 2000,
    color: 'from-orange-400 to-orange-600'
  },
  {
    id: 'skills',
    name: 'Identifying skills to develop',
    icon: TrendingUp,
    duration: 2500,
    color: 'from-pink-400 to-pink-600'
  },
  {
    id: 'finalizing',
    name: 'Generating your personalized insights',
    icon: Sparkles,
    duration: 2000,
    color: 'from-indigo-400 to-indigo-600'
  }
]

const insights = [
  "Your personality is unique among 8 billion people",
  "The average person has 5-7 career changes in their lifetime",
  "80% of success comes from understanding your strengths",
  "Self-aware people are 85% more likely to achieve their goals",
  "Your ideal career aligns with your natural talents",
  "Skills can be learned, but personality shapes how you apply them",
  "The best careers combine passion with natural ability",
  "Understanding yourself saves years of career exploration"
]

const LoadingAnimation = ({ message = "Analyzing your personality...", stage = "analyzing" }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentInsight, setCurrentInsight] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)

  useEffect(() => {
    // Progress through analysis steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 3500)

    // Overall progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          return prev + Math.random() * 15
        }
        return prev
      })
    }, 800)

    // Step-specific progress
    const stepProgressInterval = setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 5
      })
    }, 100)

    // Rotate insights
    const insightInterval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length)
    }, 4000)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
      clearInterval(stepProgressInterval)
      clearInterval(insightInterval)
    }
  }, [])

  const CurrentIcon = analysisSteps[currentStep].icon
  const currentColor = analysisSteps[currentStep].color

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] px-4 py-8">
      {/* Main Animation Container */}
      <div className="relative mb-8">
        {/* Central Icon Animation */}
        <div className="relative z-10 flex items-center justify-center">
          <div className={`w-32 h-32 bg-gradient-to-br ${currentColor} rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-1000 hover:scale-105`}>
            <CurrentIcon className="w-16 h-16 text-white animate-pulse" />
          </div>

          {/* Orbiting Elements */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8">
              <Lightbulb className="w-6 h-6 text-orange-500" />
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8">
              <Compass className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Step Display */}
      <div className="text-center max-w-lg mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {analysisSteps[currentStep].name}
        </h3>

        {/* Step Progress Bar */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto mb-4">
          <div
            className={`h-full bg-gradient-to-r ${currentColor} rounded-full transition-all duration-100`}
            style={{ width: `${stepProgress}%` }}
          />
        </div>
      </div>

      {/* Analysis Steps Timeline */}
      <div className="flex items-center space-x-2 mb-8">
        {analysisSteps.map((step, index) => {
          const StepIcon = step.icon
          return (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500
                ${index <= currentStep
                  ? `bg-gradient-to-r ${step.color} shadow-lg scale-110`
                  : 'bg-gray-200'
                }
              `}>
                <StepIcon className={`
                  w-5 h-5 transition-colors duration-500
                  ${index <= currentStep ? 'text-white' : 'text-gray-400'}
                `} />
              </div>
              {index < analysisSteps.length - 1 && (
                <div className={`
                  w-8 h-0.5 transition-all duration-500
                  ${index < currentStep ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-300'}
                `} />
              )}
            </div>
          )
        })}
      </div>

      {/* Insight Display */}
      <div className="text-center max-w-md mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <p className="text-gray-700 text-sm italic animate-fade-in" key={currentInsight}>
            <Sparkles className="inline-block w-4 h-4 text-yellow-500 mr-1" />
            {insights[currentInsight]}
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Processing your data</span>
          <span>{Math.min(Math.round(progress), 95)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 relative overflow-hidden"
            style={{ width: `${Math.min(progress, 95)}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Additional Message */}
      <p className="text-gray-500 text-sm mt-6 text-center">
        AI is crafting personalized recommendations just for you...
      </p>
    </div>
  )
}

export default LoadingAnimation