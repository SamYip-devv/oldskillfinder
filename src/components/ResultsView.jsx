import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Briefcase, Lightbulb, GraduationCap, Home, Brain, Target, BookOpen, ArrowLeft, ArrowRight, Edit3, Clock, Rocket, Map, Play, Download, MessageCircle, X, Calendar, MapPin, Users, Globe } from 'lucide-react'
import ProgressMap from './ProgressMap'
import { exportToFile } from '../services/pdfExport'
import { generatePersonalizedLearningMap } from '../services/learningMapGenerator'
import { formatText } from '../utils/textFormatting.jsx'
import ilpEventsData from '../../ilpEventsComplete_Fixed.json'

const ResultsView = ({ recommendations, onBack, onContinueWithAI }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedSkillForMap, setSelectedSkillForMap] = useState(null)
  const [selectedSkillDropdown, setSelectedSkillDropdown] = useState('')
  const [learningMapData, setLearningMapData] = useState(null)
  const [isGeneratingMap, setIsGeneratingMap] = useState(false)
  const [savedLearningMaps, setSavedLearningMaps] = useState({})
  const [savedProgress, setSavedProgress] = useState({})
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Function to get day of week from date string (YYYY-MM-DD)
  const getDayOfWeek = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString + 'T00:00:00') // Add time to avoid timezone issues
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return days[date.getDay()]
    } catch (error) {
      return ''
    }
  }

  // Build pages array dynamically based on available data
  const pages = [
    { title: 'Your Personality Profile', icon: Brain, key: 'profileSummary' },
    ...((recommendations.ilpEvents && recommendations.ilpEvents.length > 0) || recommendations.ilpRecommendations
      ? [{ title: 'ILP Recommendations', icon: BookOpen, key: 'ilpEvents' }]
      : []
    ),
    { title: 'Career Paths to Consider', icon: Briefcase, key: 'careerPaths' },
    { title: 'Skills to Build', icon: Rocket, key: 'allSkills' },
    { title: 'Learning Resources', icon: GraduationCap, key: 'education' },
    { title: 'Skills to Avoid', icon: Target, key: 'skillsToAvoid' },
    { title: 'Your Roadmap', icon: Brain, key: 'insights' }
  ]

  const currentPageData = pages[currentPage]

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const PageIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-2">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentPage(index)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentPage 
                ? 'w-8 bg-blue-500' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )

  const renderPrimarySkills = () => (
    <div className="space-y-6">
      {recommendations.primarySkills?.map((skill, index) => (
        <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
              <p className="text-gray-700 mt-2">{formatText(skill.description)}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {skill.match}% Match
            </div>
          </div>
          {skill.personalityAlignment && (
            <div className="bg-white/70 rounded-xl p-4">
              <p className="text-sm text-gray-700 font-medium mb-2">Why this suits your personality:</p>
              <p className="text-sm text-gray-600">{formatText(skill.personalityAlignment)}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderSkills = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {recommendations.skills?.map((skill, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">{skill.name}</h3>
            <div className="text-sm font-medium text-gray-500">
              {skill.match}% Match
            </div>
          </div>
          <p className="text-gray-700 text-sm">{skill.description}</p>
          <div className="mt-3 space-y-2">
            {skill.category && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {skill.category}
              </span>
            )}
            {skill.personalityTraits && (
              <p className="text-xs text-gray-600 italic">
                Personality fit: {skill.personalityTraits}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const renderAdditionalSkills = () => (
    <div className="space-y-6">
      {recommendations.additionalSkills?.map((skill, index) => (
        <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
              <p className="text-gray-700 mt-2">{formatText(skill.description)}</p>
            </div>
            <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-purple-700">
              {skill.match}% Match
            </div>
          </div>
          <div className="bg-white/70 rounded-xl p-4 mt-4">
            <p className="text-sm text-gray-700 font-medium mb-2">Why this suits your personality:</p>
            <p className="text-sm text-gray-600">{skill.reasoning}</p>
          </div>
        </div>
      ))}
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-8">
      {/* Recommended Skills Learning Paths */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Generate Your Personalized Learning Path</h3>
        
        {/* Skill Selection Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 mb-8">
          <div className="max-w-2xl mx-auto">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Select a skill to explore:</h4>
            
            <div className="space-y-4">
              <select
                value={selectedSkillDropdown}
                onChange={(e) => setSelectedSkillDropdown(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
              >
                <option value="">Choose a recommended skill...</option>
                {recommendations.skills?.map((skill, index) => (
                  <option key={index} value={index}>
                    {skill.name} ({skill.match || 85}% Match)
                  </option>
                ))}
              </select>
              
              {selectedSkillDropdown !== '' && recommendations.skills[selectedSkillDropdown] && (
                <div className="mt-4 p-4 bg-white/70 rounded-xl">
                  <p className="text-gray-700">{recommendations.skills[selectedSkillDropdown].description}</p>
                  {recommendations.skills[selectedSkillDropdown].personalityAlignment && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <strong>Why this suits you:</strong> {recommendations.skills[selectedSkillDropdown].personalityAlignment}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={() => {
                  if (selectedSkillDropdown !== '' && recommendations.skills[selectedSkillDropdown]) {
                    handleGenerateLearningMap(recommendations.skills[selectedSkillDropdown])
                  }
                }}
                disabled={selectedSkillDropdown === '' || isGeneratingMap}
                className={`w-full mt-4 py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                  selectedSkillDropdown === '' || isGeneratingMap
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                }`}
              >
                <Map className="w-5 h-5" />
                <span>{isGeneratingMap ? 'Generating...' : 'Generate Learning Map'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Saved Learning Journeys */}
        {Object.keys(savedLearningMaps).length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Saved Learning Journeys</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(savedLearningMaps).map(([skillName, mapData], index) => {
                const skill = recommendations.skills?.find(s => s.name === skillName)
                const progress = savedProgress[skillName] || { completedSteps: new Set() }
                const totalSteps = mapData.phases?.reduce((acc, phase) => acc + (phase.steps?.length || 0), 0) || 0
                const completionPercentage = totalSteps > 0 ? Math.round((progress.completedSteps.size / totalSteps) * 100) : 0
                
                return (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-300 hover:border-green-400 transition-all cursor-pointer"
                    onClick={() => {
                      setLearningMapData(mapData)
                      setSelectedSkillForMap(skill)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{skillName}</h5>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-green-600">{completionPercentage}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{mapData.estimatedDuration}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-green-600 font-medium">Continue journey →</p>
                      <span className="text-xs text-gray-500">{progress.completedSteps.size}/{totalSteps} steps</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderWorkEnvironment = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {recommendations.workEnvironment?.map((env, index) => (
        <div key={index} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">{env.name}</h3>
          <p className="text-gray-700 text-sm">{env.description}</p>
        </div>
      ))}
    </div>
  )

  const renderProfileSummary = () => (
    <div className="space-y-8">
      {/* Main Profile Summary */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
            {formatText(recommendations.profileSummary)}
          </p>
        </div>
      </div>
      
      {/* Core Profile Traits */}
      {recommendations.coreProfile && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Your Core Profile: {recommendations.coreProfile.title}
          </h3>
          <div className="space-y-6">
            {recommendations.coreProfile.traits?.map((trait, index) => (
              <div key={index} className="bg-white/70 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">{trait.category}:</span> {trait.description} 
                  <span className="text-sm text-gray-600 block mt-2">
                    ({trait.evidence})
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderInsights = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Insights</h3>
        <p className="text-gray-700 leading-relaxed text-lg">{formatText(recommendations.insights)}</p>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Next Steps</h3>
        <div className="space-y-4">
          {recommendations.nextSteps?.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-gray-700">{formatText(step)}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* AI Career Advisor CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white/20 rounded-xl mr-4">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold">Continue Your Journey with AI Career Advisor</h3>
          </div>
          
          <p className="text-lg text-purple-100 mb-6">
            Get personalized career guidance from an AI that knows your unique personality profile. 
            Ask questions, explore opportunities, and get tailored advice for your career journey.
          </p>
          
          <button
            onClick={() => onContinueWithAI && onContinueWithAI()}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all flex items-center space-x-2 group"
          >
            <span>Start Chatting with Your AI Advisor</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )

  const renderAllSkills = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Hard Skills</h3>
      {recommendations.skills?.map((skill, index) => (
        <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
              <p className="text-gray-700 mt-2">{formatText(skill.description)}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {skill.match || 85}% Match
            </div>
          </div>
          
          {skill.personalityAlignment && (
            <div className="bg-white/70 rounded-xl p-4">
              <p className="text-sm text-gray-700 font-medium mb-2">Why this suits your personality:</p>
              <p className="text-sm text-gray-600">{formatText(skill.personalityAlignment)}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderCareerPaths = () => (
    <div className="space-y-6">
      {recommendations.careerPaths?.map((career, index) => (
        <div key={index} className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-indigo-900">{career.name}</h3>
            <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {career.match || 85}% Match
            </div>
          </div>
          <p className="text-indigo-700 mb-4">{career.description}</p>
          {career.personalityAlignment && (
            <div className="bg-white/70 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-indigo-800 mb-1">Why this suits your personality:</p>
              <p className="text-sm text-indigo-600">{career.personalityAlignment}</p>
            </div>
          )}
          {career.skillsNeeded && (
            <div className="bg-indigo-100 rounded-xl p-4">
              <p className="text-sm font-medium text-indigo-900 mb-2">Key skills for this path:</p>
              <p className="text-sm text-indigo-700">{career.skillsNeeded}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderSkillsToAvoid = () => (
    <div className="space-y-6">
      {recommendations.skillsToAvoid?.map((skill, index) => (
        <div key={index} className="bg-red-50 rounded-2xl p-6 border border-red-200">
          <h3 className="text-xl font-bold text-red-900 mb-3">{skill.name}</h3>
          <p className="text-red-700 mb-4">{skill.reason}</p>
          {skill.personalityMismatch && (
            <div className="bg-white/70 rounded-xl p-4">
              <p className="text-sm font-medium text-red-800 mb-1">Personality mismatch:</p>
              <p className="text-sm text-red-600">{skill.personalityMismatch}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderILPEvents = () => {
    // Check if we have the full ILP recommendations structure
    if (!recommendations.ilpRecommendations) {
      // Fall back to simple ilpEvents array if full structure isn't available
      if (!recommendations.ilpEvents || recommendations.ilpEvents.length === 0) {
        return (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No ILP recommendations available yet.</p>
            <p className="text-sm text-gray-500 mt-2">Complete more personality assessments to get personalized ILP event recommendations.</p>
          </div>
        )
      }

      // Simple rendering for backwards compatibility
      return (
        <div className="space-y-8">
          {recommendations.ilpTheme && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Your ILP Journey Theme</h3>
              <p className="text-gray-700 leading-relaxed">{formatText(recommendations.ilpTheme)}</p>
            </div>
          )}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Recommended ILP Events</h3>
            {recommendations.ilpEvents.map((event, index) => {
              const crnMatch = event.name?.match(/\[([^\]]+)\]/)
              const crn = crnMatch ? crnMatch[1] : null
              const eventName = event.name?.replace(/\[[^\]]+\]\s*/, '') || event.name
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{eventName}</h3>
                      {crn && (
                        <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          CRN: {crn}
                        </span>
                      )}
                    </div>
                  </div>
                  {event.description && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-700 font-medium mb-1">Why this event suits you:</p>
                      <p className="text-sm text-gray-600">{formatText(event.description)}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    // Full ILP recommendations rendering with all domains
    const domainInfo = {
      CELD: { name: 'Civic Education & Leadership Development', abbr: 'CELD' },
      IED: { name: 'Intellectual & Entrepreneurship Development', abbr: 'IED' },
      SEW: { name: 'Social & Emotional Well-being', abbr: 'SEW' },
      PFW: { name: 'Physical Fitness & Well-being', abbr: 'PFW' },
      AES: { name: 'Aesthetic Development', abbr: 'AES' },
      RE: { name: 'Residential Education', abbr: 'RE' }
    }

    return (
      <div className="space-y-8">
        {/* ILP Theme Overview */}
        {recommendations.ilpTheme && (
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Your ILP Journey Theme</h3>
            <p className="text-gray-700 leading-relaxed">{formatText(recommendations.ilpTheme)}</p>
          </div>
        )}

        {/* ILP Events by Domain - Clean Grid Layout */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Lingnan University ILP Event Recommendations</h3>
            <span className="text-sm text-gray-500">6 Domains • Personalized for You</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(recommendations.ilpRecommendations).map(([domain, domainRecs]) => {
              const info = domainInfo[domain]
              if (!info || !domainRecs) return null

              // Parse all events
              const parseEvent = (event) => {
                const match = event?.match(/\[([^\]]+)\]/)
                return {
                  crn: match ? match[1] : null,
                  name: event?.replace(/\[[^\]]+\]\s*/, '') || event
                }
              }

              const primaryEvent = parseEvent(domainRecs.primary)
              const alternativeEvents = domainRecs.alternatives?.map(parseEvent) || []

              return (
                <div key={domain} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Domain Header - Simple and Clean */}
                  <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{info.abbr}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{info.name}</p>
                    </div>
                  </div>

                  {/* Events List - Primary + Alternatives Together */}
                  <div className="p-5 space-y-3">
                    {/* Primary Event */}
                    <div className="space-y-2">
                      <div
                        className="cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                        onClick={() => {
                          const eventData = ilpEventsData.eventsByName[Object.keys(ilpEventsData.eventsByName).find(key =>
                            ilpEventsData.eventsByName[key].crn === primaryEvent.crn
                          )]
                          if (eventData) setSelectedEvent(eventData)
                        }}
                      >
                        <div className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                              {primaryEvent.name}
                            </p>
                            {primaryEvent.crn && (
                              <span className="inline-block mt-1 text-xs text-gray-500">
                                CRN: {primaryEvent.crn}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alternative Events */}
                    {alternativeEvents.map((altEvent, idx) => (
                      <div key={idx} className="space-y-2">
                        <div
                          className="cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                          onClick={() => {
                            const eventData = ilpEventsData.eventsByName[Object.keys(ilpEventsData.eventsByName).find(key =>
                              ilpEventsData.eventsByName[key].crn === altEvent.crn
                            )]
                            if (eventData) setSelectedEvent(eventData)
                          }}
                        >
                          <div className="flex items-start space-x-2">
                            <span className="text-gray-400 mt-0.5">•</span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
                                {altEvent.name}
                              </p>
                              {altEvent.crn && (
                                <span className="inline-block mt-1 text-xs text-gray-500">
                                  CRN: {altEvent.crn}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Reasoning */}
                    {domainRecs.reasoning && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600 italic">{domainRecs.reasoning}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* How to Register */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">How to Register for ILP Events at Lingnan University</h3>
          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold text-gray-900 mr-3">1.</span>
              <span>Log in to Lingnan Portal with your student account</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-gray-900 mr-3">2.</span>
              <span>Navigate to the ILP section</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-gray-900 mr-3">3.</span>
              <span>Search for events using the CRN numbers provided above</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-gray-900 mr-3">4.</span>
              <span>Check the schedule and register for events that fit your timetable</span>
            </li>
          </ol>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> Some events may have prerequisites or limited capacity. Register early to secure your spot!
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentPageData.key) {
      case 'profileSummary':
        return renderProfileSummary()
      case 'allSkills':
        return renderAllSkills()
      case 'education':
        return renderEducation()
      case 'careerPaths':
        return renderCareerPaths()
      case 'skillsToAvoid':
        return renderSkillsToAvoid()
      case 'insights':
        return renderInsights()
      case 'ilpEvents':
        return renderILPEvents()
      default:
        return null
    }
  }

  const Icon = currentPageData.icon

  const handleGenerateLearningMap = async (skill) => {
    // Check if we already have a saved map for this skill
    if (savedLearningMaps[skill.name]) {
      setLearningMapData(savedLearningMaps[skill.name])
      setSelectedSkillForMap(skill)
      return
    }
    
    setIsGeneratingMap(true)
    setSelectedSkillForMap(skill)
    
    try {
      // Create a comprehensive user profile from recommendations
      const userProfile = `
Profile Summary: ${recommendations.profileSummary || 'Not available'}

Core Profile: ${recommendations.coreProfile ? `${recommendations.coreProfile.title}
${recommendations.coreProfile.traits?.map(t => `- ${t.category}: ${t.description}`).join('\n')}` : 'Not available'}

Key Insights: ${recommendations.insights || 'Not available'}
      `.trim()
      
      // Pass the complete personality data
      const personalityData = {
        coreProfile: recommendations.coreProfile,
        skills: recommendations.skills,
        careerPaths: recommendations.careerPaths,
        insights: recommendations.insights
      }
      
      const learningMap = await generatePersonalizedLearningMap(skill, userProfile, personalityData)
      setLearningMapData(learningMap)
      
      // Save the generated map
      setSavedLearningMaps(prev => ({
        ...prev,
        [skill.name]: learningMap
      }))
    } catch (error) {
      console.error('Failed to generate learning map:', error)
      alert('Failed to generate learning map. Please try again.')
    } finally {
      setIsGeneratingMap(false)
    }
  }

  return (
    <>
      {/* Event Detail Modal - Compact Popup with Full Info */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-start justify-between z-10">
              <div className="flex-1 pr-2">
                <h3 className="text-sm font-bold text-gray-900">{selectedEvent.titleEng}</h3>
                {selectedEvent.titleChi && (
                  <p className="text-xs text-gray-600 mt-0.5">{selectedEvent.titleChi}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Basic Info */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">CRN</p>
                  <p className="font-semibold text-gray-900">{selectedEvent.crn}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">ILP Units</p>
                  <p className="font-semibold text-gray-900">{selectedEvent.ilpUnits}</p>
                </div>
                {selectedEvent.programType && (
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedEvent.programType}</p>
                  </div>
                )}
              </div>

              {/* Schedule with Day of Week */}
              {selectedEvent.schedule && selectedEvent.schedule.sessions && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Schedule</p>
                  <div className="space-y-2">
                    {selectedEvent.schedule.sessions.map((session, idx) => (
                      <div key={idx} className="text-xs text-gray-600">
                        <div className="font-medium">
                          {session.dayOfWeek || getDayOfWeek(session.date)}, {session.date}
                        </div>
                        <div className="text-gray-500">
                          {session.startTime} - {session.endTime} • {session.venue}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Description */}
              {selectedEvent.description && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Description</p>
                  <p className="text-xs text-gray-600 whitespace-pre-line">{selectedEvent.description}</p>
                </div>
              )}

              {/* Full Objectives */}
              {selectedEvent.objectives && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Learning Objectives</p>
                  <p className="text-xs text-gray-600 whitespace-pre-line">{selectedEvent.objectives}</p>
                </div>
              )}

              {/* Instructor */}
              {selectedEvent.instructor && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Instructor</p>
                  <p className="text-xs text-gray-600">
                    {typeof selectedEvent.instructor === 'object'
                      ? `${selectedEvent.instructor.name || 'TBA'}${selectedEvent.instructor.title ? ` - ${selectedEvent.instructor.title}` : ''}`
                      : selectedEvent.instructor}
                  </p>
                </div>
              )}

              {/* Language & Mode */}
              <div className="flex flex-wrap gap-3 text-xs">
                {selectedEvent.deliveryMode && (
                  <div>
                    <span className="text-gray-500">Mode: </span>
                    <span className="text-gray-700 font-medium">{selectedEvent.deliveryMode}</span>
                  </div>
                )}
                {selectedEvent.mediumOfInstruction && (
                  <div>
                    <span className="text-gray-500">Language: </span>
                    <span className="text-gray-700 font-medium">
                      {Object.entries(selectedEvent.mediumOfInstruction)
                        .filter(([, value]) => value)
                        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                        .join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Tests</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <button
              onClick={async () => {
                try {
                  await exportToFile(recommendations, 'pdf')
                } catch (error) {
                  console.error('Export failed:', error)
                  alert('Failed to export PDF. Please try again.')
                }
              }}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:shadow-md transition-all text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={onBack}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-sm sm:text-base"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Tests</span>
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <div className={`bg-gradient-to-r ${
            currentPage === 0 ? 'from-purple-500 to-purple-600' :
            currentPage === 1 ? 'from-blue-500 to-blue-600' :
            currentPage === 2 ? 'from-green-500 to-green-600' :
            currentPage === 3 ? 'from-indigo-500 to-indigo-600' :
            currentPage === 4 ? 'from-red-500 to-red-600' :
            currentPage === 5 ? 'from-orange-500 to-orange-600' :
            'from-pink-500 to-pink-600'
          } p-4 rounded-2xl inline-block mb-4`}>
            <Icon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{currentPageData.title}</h1>
        </div>

        {/* Page Indicator */}
        <PageIndicator />

        {/* Content */}
        <div className="mb-12 animate-fade-in">
          {renderContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all text-sm sm:text-base ${
              currentPage === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow hover:shadow-md'
            }`}
          >
            <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <span className="text-xs sm:text-sm text-gray-600">
            {currentPage + 1} of {pages.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === pages.length - 1}
            className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all text-sm sm:text-base ${
              currentPage === pages.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </div>
        </div>
      </div>
      
      {/* Progress Map Modal */}
      {(selectedSkillForMap || isGeneratingMap) && (
        <ProgressMap 
          skill={selectedSkillForMap}
          learningMapData={learningMapData}
          isGenerating={isGeneratingMap}
          savedProgress={savedProgress[selectedSkillForMap?.name]?.completedSteps}
          onProgressUpdate={(completedSteps) => {
            if (selectedSkillForMap) {
              setSavedProgress(prev => ({
                ...prev,
                [selectedSkillForMap.name]: { completedSteps }
              }))
            }
          }}
          onClose={() => {
            setSelectedSkillForMap(null)
            setLearningMapData(null)
            setIsGeneratingMap(false)
          }} 
        />
      )}
    </>
  )
}

export default ResultsView