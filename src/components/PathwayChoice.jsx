import React from 'react'
import { Clock, FileText, ArrowRight, Sparkles, Target, CheckCircle } from 'lucide-react'

const PathwayChoice = ({ onChoosePathway }) => {
  return (
    <div className="py-6">
      <div className="max-w-5xl w-full">
        {/* Header Block */}
        <div className="moodle-block mb-6">
          <div className="moodle-block-header">
            <h1 className="text-2xl font-bold text-moodle-blue-dark">Choose Your Discovery Path</h1>
          </div>
          <div className="moodle-block-content">
            <p className="text-gray-700">
              Select the approach that best fits your time and goals
            </p>
          </div>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Deep Analysis Card */}
          <div className="moodle-block">
            <div className="moodle-block-header flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-moodle-blue p-2 rounded text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-moodle-blue-dark">Deep Personality Analysis</h2>
              </div>
              <span className="text-xs font-medium text-moodle-blue bg-moodle-blue-light px-2 py-1 rounded">
                2-3 hours
              </span>
            </div>
            <div className="moodle-block-content">
              <p className="text-gray-700 mb-4">
                I have test results from personality assessments and want comprehensive career guidance
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Upload results from Big 5, RIASEC, CliftonStrengths</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Get detailed skill recommendations & career paths</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Personalized learning roadmaps for each skill</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">In-depth personality insights & analysis</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-600">
                  Best for: Serious career planning
                </span>
                <button
                  onClick={() => onChoosePathway('deep')}
                  className="btn-primary text-sm flex items-center space-x-1"
                >
                  <span>Start</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Test Card */}
          <div className="moodle-block">
            <div className="moodle-block-header flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-moodle-blue-dark">Quick Skills Discovery</h2>
              </div>
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                5-10 minutes
              </span>
            </div>
            <div className="moodle-block-content">
              <p className="text-gray-700 mb-4">
                I don't have test results and want a quick assessment with instant recommendations
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Answer simple questions about your interests</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Get instant skill recommendations</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Discover 3-5 career paths to explore</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Quick actionable insights</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-600">
                  Best for: Quick exploration
                </span>
                <button
                  onClick={() => onChoosePathway('quick')}
                  className="btn-primary text-sm flex items-center space-x-1"
                >
                  <span>Start</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="moodle-block mt-4">
          <div className="moodle-block-content text-center">
            <p className="text-sm text-gray-600">
              Not sure which to choose? Start with the quick test and upgrade later!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PathwayChoice