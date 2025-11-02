import React, { useState, useEffect } from 'react'
import { CheckCircle, Circle, ArrowRight, Target, Calendar, Clock, Star, AlertCircle, Loader2 } from 'lucide-react'
import LoadingAnimation from './LoadingAnimation'
import { formatText } from '../utils/textFormatting.jsx'

const ProgressMap = ({ skill, learningMapData, onClose, isGenerating = false, savedProgress, onProgressUpdate }) => {
  const [completedSteps, setCompletedSteps] = useState(savedProgress || new Set())
  const [expandedChallenges, setExpandedChallenges] = useState(false)

  const toggleStep = (stepId) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId)
    } else {
      newCompleted.add(stepId)
    }
    setCompletedSteps(newCompleted)
    
    // Update parent component with progress
    if (onProgressUpdate) {
      onProgressUpdate(newCompleted)
    }
  }

  if (!learningMapData && !isGenerating) {
    return null
  }

  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <LoadingAnimation 
            message="Generating your personalized learning map..." 
            stage="analyzing"
          />
        </div>
      </div>
    )
  }

  const completionPercentage = Math.round(
    (completedSteps.size / learningMapData.phases.reduce((acc, phase) => acc + phase.steps.length, 0)) * 100
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col my-2 sm:my-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{learningMapData.skillName} Learning Path</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Your personalized roadmap • {learningMapData.estimatedDuration}</p>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="text-center hidden sm:block">
                <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl p-1"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Personalized Approach */}
          {learningMapData.personalizedApproach && (
            <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">Your Personalized Approach:</strong> {formatText(learningMapData.personalizedApproach)}
              </p>
            </div>
          )}

          {/* Progress Map */}
          <div className="p-6">
          <div className="space-y-8">
            {learningMapData.phases.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="relative">
                {/* Phase Header */}
                <div className={`bg-gradient-to-r ${phase.color} rounded-xl p-4 mb-4`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-white gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold">{phase.title}</h3>
                      <p className="text-white/80 text-sm sm:text-base">{phase.duration} • {phase.focus}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-sm">
                        {phase.steps.filter(step => completedSteps.has(step.id)).length}/{phase.steps.length} completed
                      </div>
                    </div>
                  </div>
                  {phase.personalityNote && (
                    <p className="mt-2 text-white/90 text-sm italic">{formatText(phase.personalityNote)}</p>
                  )}
                </div>

                {/* Steps */}
                <div className="space-y-3 sm:pl-4">
                  {phase.steps.map((step, stepIndex) => {
                    const isCompleted = completedSteps.has(step.id)
                    const difficultyColors = {
                      'Beginner': 'bg-green-100 text-green-700',
                      'Intermediate': 'bg-yellow-100 text-yellow-700',
                      'Advanced': 'bg-red-100 text-red-700'
                    }

                    return (
                      <div 
                        key={step.id}
                        className={`flex items-start space-x-3 p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          isCompleted 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                        onClick={() => toggleStep(step.id)}
                      >
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-semibold ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                              {step.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[step.difficulty]}`}>
                                {step.difficulty}
                              </span>
                              {step.timeEstimate && (
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {step.timeEstimate}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                            {formatText(step.description)}
                          </p>
                          
                          {step.personalizedTip && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                              <p className="text-xs text-blue-700">
                                <strong>💡 Tip for you:</strong> {formatText(step.personalizedTip)}
                              </p>
                            </div>
                          )}
                          
                          {step.resources && step.resources.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-gray-700 mb-1">Resources:</p>
                              <div className="flex flex-wrap gap-2">
                                {step.resources.map((resource, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Connector Line */}
                {phaseIndex < learningMapData.phases.length - 1 && (
                  <div className="flex justify-center my-6">
                    <ArrowRight className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Milestones */}
          {learningMapData.milestones && learningMapData.milestones.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                Milestones & Rewards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {learningMapData.milestones.map((milestone, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {milestone.value}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {milestone.metric}
                      </div>
                      <div className="text-sm font-medium text-gray-800 mt-2">
                        {milestone.reward}
                      </div>
                      {milestone.description && (
                        <p className="text-xs text-gray-600 mt-1">{milestone.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personality-Based Tips */}
          {learningMapData.personalityBasedTips && learningMapData.personalityBasedTips.length > 0 && (
            <div className="mt-6 bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Tips Based on Your Personality</h3>
              <ul className="space-y-2">
                {learningMapData.personalityBasedTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span className="text-sm text-gray-700">{formatText(tip)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Potential Challenges */}
          {learningMapData.potentialChallenges && learningMapData.potentialChallenges.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setExpandedChallenges(!expandedChallenges)}
                className="w-full bg-red-50 rounded-xl p-4 border border-red-200 hover:bg-red-100 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    Potential Challenges & Solutions
                  </h3>
                  <span className="text-gray-500">{expandedChallenges ? '−' : '+'}</span>
                </div>
              </button>
              {expandedChallenges && (
                <div className="mt-4 space-y-3">
                  {learningMapData.potentialChallenges.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-red-100">
                      <p className="text-sm font-medium text-red-800 mb-1">Challenge: {formatText(item.challenge)}</p>
                      <p className="text-sm text-gray-700">
                        <strong>Solution:</strong> {formatText(item.solution)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressMap