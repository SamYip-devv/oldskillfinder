import React, { useState } from 'react'
import { BookOpen, Clock, Users, Star, ChevronRight, Filter } from 'lucide-react'

// Sample course data
const sampleCourses = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    instructor: 'Dr. Sarah Chen',
    category: 'Computer Science',
    duration: '8 weeks',
    students: 1250,
    rating: 4.7,
    price: 'Free',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern web applications.',
    image: '🌐'
  },
  {
    id: 2,
    title: 'Business Strategy and Planning',
    instructor: 'Prof. Michael Johnson',
    category: 'Business & Management',
    duration: '6 weeks',
    students: 890,
    rating: 4.5,
    price: '$49',
    description: 'Develop strategic thinking skills and learn to create effective business plans.',
    image: '📊'
  },
  {
    id: 3,
    title: 'Digital Marketing Fundamentals',
    instructor: 'Dr. Emily Rodriguez',
    category: 'Business & Management',
    duration: '4 weeks',
    students: 2100,
    rating: 4.8,
    price: 'Free',
    description: 'Master SEO, social media marketing, and content creation strategies.',
    image: '📱'
  },
  {
    id: 4,
    title: 'Data Science with Python',
    instructor: 'Dr. James Wilson',
    category: 'Computer Science',
    duration: '10 weeks',
    students: 1650,
    rating: 4.9,
    price: '$79',
    description: 'Learn data analysis, visualization, and machine learning using Python.',
    image: '📈'
  },
  {
    id: 5,
    title: 'Creative Writing Workshop',
    instructor: 'Prof. Lisa Anderson',
    category: 'Arts & Humanities',
    duration: '5 weeks',
    students: 650,
    rating: 4.6,
    price: '$39',
    description: 'Develop your writing skills through exercises and peer feedback.',
    image: '✍️'
  },
  {
    id: 6,
    title: 'Introduction to Psychology',
    instructor: 'Dr. Robert Brown',
    category: 'Social Sciences',
    duration: '12 weeks',
    students: 3200,
    rating: 4.7,
    price: 'Free',
    description: 'Explore the fundamentals of human behavior and mental processes.',
    image: '🧠'
  }
]

const CourseBrowser = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Courses')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = sampleCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All Courses' || course.category === selectedCategory
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = ['All Courses', ...new Set(sampleCourses.map(c => c.category))]

  return (
    <div className="py-6">
      {/* Filters */}
      <div className="moodle-block mb-6">
        <div className="moodle-block-header flex items-center justify-between">
          <h2 className="text-lg font-bold text-moodle-blue-dark flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Courses</span>
          </h2>
        </div>
        <div className="moodle-block-content">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded border text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-moodle-blue text-white border-moodle-blue'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-moodle-blue"
            />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-moodle-blue-dark">
          {selectedCategory} ({filteredCourses.length} courses)
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => (
          <div key={course.id} className="moodle-block hover:shadow-md transition-shadow">
            <div className="moodle-block-content">
              {/* Course Image/Icon */}
              <div className="text-6xl text-center mb-4">{course.image}</div>
              
              {/* Course Info */}
              <div className="mb-3">
                <span className="text-xs font-semibold text-moodle-blue bg-moodle-blue-light px-2 py-1 rounded">
                  {course.category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-moodle-blue-dark mb-2">
                {course.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>
              
              {/* Course Meta */}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{course.rating} rating</span>
                </div>
              </div>
              
              {/* Price and Enroll */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-lg font-bold text-moodle-blue">
                  {course.price}
                </span>
                <button className="btn-primary text-sm flex items-center space-x-1">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="moodle-block">
          <div className="moodle-block-content text-center py-8">
            <p className="text-gray-600">No courses found matching your criteria.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseBrowser

