import React from 'react'
import { Clock, FileText, ArrowRight, Sparkles, Target, CheckCircle } from 'lucide-react'

const PathwayChoice = ({ onChoosePathway }) => {
  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Discovery Path
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the approach that best fits your time and goals
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Deep Analysis Card */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={() => onChoosePathway('deep')}
              className="w-full h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left group hover:scale-105"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl text-white">
                  <FileText className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  2-3 hours
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Deep Personality Analysis
              </h2>
              
              <p className="text-gray-600 mb-6">
                I have test results from personality assessments and want comprehensive career guidance
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Upload results from Big 5, RIASEC, CliftonStrengths</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Get detailed skill recommendations & career paths</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Personalized learning roadmaps for each skill</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">In-depth personality insights & analysis</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Best for: Serious career planning
                </span>
                <ArrowRight className="w-6 h-6 text-purple-600 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>

          {/* Quick Test Card */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => onChoosePathway('quick')}
              className="w-full h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left group hover:scale-105"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl text-white">
                  <Clock className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  5-10 minutes
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Quick Skills Discovery
              </h2>
              
              <p className="text-gray-600 mb-6">
                I don't have test results and want a quick assessment with instant recommendations
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Answer simple questions about your interests</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Get instant skill recommendations</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Discover 3-5 career paths to explore</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Quick actionable insights</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Best for: Quick exploration
                </span>
                <ArrowRight className="w-6 h-6 text-green-600 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-gray-500">
            Not sure which to choose? Start with the quick test and upgrade later!
          </p>
        </div>
      </div>
    </div>
  )
}

export default PathwayChoice