import React, { useState } from 'react'
import { BookOpen, Users, Brain, Heart, Activity, Palette, Home, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { getDomainInfo } from '../services/ilpRecommender'

const domainIcons = {
  CELD: Users,
  IED: Brain,
  SEW: Heart,
  PFW: Activity,
  AES: Palette,
  RE: Home
}

const domainColors = {
  CELD: 'from-blue-500 to-blue-600',
  IED: 'from-purple-500 to-purple-600',
  SEW: 'from-pink-500 to-pink-600',
  PFW: 'from-green-500 to-green-600',
  AES: 'from-orange-500 to-orange-600',
  RE: 'from-indigo-500 to-indigo-600'
}

const ILPDomainCard = ({ domain, recommendations, domainInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = domainIcons[domain] || BookOpen
  const color = domainColors[domain] || 'from-gray-500 to-gray-600'
  
  if (!recommendations) return null
  
  // Extract CRN and name from the recommendation format
  const parseCRN = (recommendation) => {
    const match = recommendation.match(/\[(\d+)\]\s*(.+)/)
    if (match) {
      return { crn: match[1], name: match[2] }
    }
    return { crn: '', name: recommendation }
  }
  
  const primary = parseCRN(recommendations.primary)
  const alternatives = recommendations.alternatives?.map(parseCRN) || []
  
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`bg-gradient-to-r ${color} p-3 rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{domainInfo.fullName}</h3>
            <p className="text-sm text-gray-500">{domainInfo.nameChi}</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      
      {/* Primary Recommendation */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Top Recommendation</div>
        <div className={`bg-gradient-to-r ${color} bg-opacity-10 rounded-lg p-4`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 mb-1">{primary.name}</h4>
              {primary.crn && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  CRN: {primary.crn}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Reasoning */}
      {recommendations.reasoning && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 italic">{recommendations.reasoning}</p>
        </div>
      )}
      
      {/* Alternative Recommendations (Expandable) */}
      {isExpanded && alternatives.length > 0 && (
        <div className="animate-fade-in">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Alternative Options</div>
          <div className="space-y-2">
            {alternatives.map((alt, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-700">{alt.name}</h5>
                    {alt.crn && (
                      <span className="inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs font-medium bg-white text-gray-600">
                        CRN: {alt.crn}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const ILPRecommendations = ({ ilpRecommendations, ilpTheme }) => {
  if (!ilpRecommendations) return null
  
  const domainOrder = ['CELD', 'IED', 'SEW', 'PFW', 'AES', 'RE']
  
  return (
    <div className="animate-fade-in mt-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-primary-500 mr-2" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Your ILP Event Recommendations
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Personalized CityU Integrated Learning Programme events based on your personality profile
        </p>
        
        {ilpTheme && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 max-w-3xl mx-auto">
            <p className="text-blue-700 text-sm">
              📚 <span className="font-medium">Your ILP Theme:</span> {ilpTheme}
            </p>
          </div>
        )}
      </div>
      
      {/* ILP Information Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-2">About ILP at CityU</h3>
            <p className="text-sm text-gray-600 mb-3">
              The Integrated Learning Programme (ILP) helps you develop skills beyond your major through 6 domains of learning. 
              Each domain offers unique experiences to enhance your personal and professional growth.
            </p>
            <a 
              href="https://www.cityu.edu.hk/ilp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Learn more about ILP
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Recommendations Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {domainOrder.map(domain => {
          const domainInfo = getDomainInfo(domain)
          return (
            <ILPDomainCard
              key={domain}
              domain={domain}
              recommendations={ilpRecommendations[domain]}
              domainInfo={domainInfo}
            />
          )
        })}
      </div>
      
      {/* How to Register Section */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">How to Register for ILP Events</h3>
        <ol className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">1.</span>
            Log in to CityU AIMS with your student account
          </li>
          <li className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">2.</span>
            Navigate to the ILP section
          </li>
          <li className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">3.</span>
            Search for events using the CRN numbers provided above
          </li>
          <li className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">4.</span>
            Register for events that fit your schedule and interests
          </li>
        </ol>
      </div>
    </div>
  )
}

export default ILPRecommendations