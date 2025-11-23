import React, { useState } from 'react'
import { MapPin, X } from 'lucide-react'

// Location coordinates on the map (these are relative positions as percentages)
// You may need to adjust these based on the actual map image
const locationPins = [
  { code: 'LBY102', x: 25, y: 40, building: 'Lee Byung Hall', description: 'Lecture Hall' },
  { code: 'LKK105', x: 45, y: 35, building: 'Lee Ka Kit Building', description: 'Classroom' },
  { code: 'LKK301', x: 47, y: 30, building: 'Lee Ka Kit Building', description: 'Classroom' },
  { code: 'SEK102', x: 60, y: 50, building: 'Sek Yuen Building', description: 'Lecture Hall' },
  { code: 'SEKG01', x: 62, y: 55, building: 'Sek Yuen Building', description: 'Ground Floor' }
]

const CampusMap = ({ courses = [] }) => {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [hoveredLocation, setHoveredLocation] = useState(null)

  // Get courses for each location
  const getCoursesForLocation = (locationCode) => {
    return courses.filter(course => 
      course.timetable?.some(session => 
        session.venue?.includes(locationCode) || session.venueCode === locationCode
      )
    )
  }

  return (
    <div className="w-full">
      <div className="moodle-block mb-4">
        <div className="moodle-block-header">
          <h2 className="text-lg font-bold text-orange-700 flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Campus Map</span>
          </h2>
        </div>
        <div className="moodle-block-content p-4">
          <p className="text-sm text-gray-600 mb-4">
            Click on the location pins to see which courses are held there.
          </p>
          
          {/* Map Container */}
          <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-300" style={{ minHeight: '600px' }}>
            <img 
              src="/CampusMap/Map 2025 colour.jpg" 
              alt="Campus Map" 
              className="w-full h-auto"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                // Fallback if image path doesn't work
                console.error('Failed to load campus map image')
                e.target.style.display = 'none'
              }}
            />
            
            {/* Location Pins */}
            {locationPins.map((location) => {
              const locationCourses = getCoursesForLocation(location.code)
              return (
                <div
                  key={location.code}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedLocation(location)}
                  onMouseEnter={() => setHoveredLocation(location.code)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  {/* Pin Icon */}
                  <div className="relative">
                    <MapPin 
                      className={`w-8 h-8 transition-all ${
                        selectedLocation?.code === location.code || hoveredLocation === location.code
                          ? 'text-red-600 scale-125'
                          : 'text-orange-600'
                      }`}
                      fill="currentColor"
                    />
                    {/* Pulse animation */}
                    {selectedLocation?.code === location.code && (
                      <div className="absolute inset-0 animate-ping">
                        <MapPin className="w-8 h-8 text-red-400 opacity-75" />
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip on hover */}
                  {hoveredLocation === location.code && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                      <div className="font-semibold">{location.code}</div>
                      <div className="text-gray-300">{location.building}</div>
                      {locationCourses.length > 0 && (
                        <div className="mt-1 text-orange-300">
                          {locationCourses.length} course{locationCourses.length > 1 ? 's' : ''}
                        </div>
                      )}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Location Details Panel */}
          {selectedLocation && (
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedLocation.code}</h3>
                  <p className="text-sm text-gray-600">{selectedLocation.building}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedLocation.description}</p>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Courses at this location */}
              {getCoursesForLocation(selectedLocation.code).length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Courses at this location:
                  </h4>
                  <div className="space-y-2">
                    {getCoursesForLocation(selectedLocation.code).map((course) => (
                      <div key={course.id} className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex items-start space-x-2">
                          <span className="text-xl">{course.image}</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{course.title}</p>
                            <div className="mt-1 space-y-1">
                              {course.timetable
                                ?.filter(session => 
                                  session.venue?.includes(selectedLocation.code) || 
                                  session.venueCode === selectedLocation.code
                                )
                                .map((session, idx) => (
                                  <div key={idx} className="text-xs text-gray-600">
                                    <span className="font-medium">{session.day}</span> • {session.time} • {session.type}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No courses scheduled at this location.</p>
              )}
            </div>
          )}

          {/* Location Legend */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Location Codes:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {locationPins.map((location) => (
                <div key={location.code} className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-gray-700">{location.code}</span>
                  <span className="text-gray-500">- {location.building}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampusMap

