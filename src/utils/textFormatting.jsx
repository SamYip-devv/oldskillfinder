import React from 'react'

// Utility function to parse markdown-style bold text and convert to React elements
export const parseMarkdownBold = (text) => {
  if (!text || typeof text !== 'string') return text
  
  // Split by ** markers
  const parts = text.split(/\*\*(.*?)\*\*/g)
  
  if (parts.length === 1) return text // No bold markers found
  
  // Convert to React elements
  const result = parts.map((part, index) => {
    // Odd indices are the bold parts
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>
    }
    return part !== '' ? part : null
  }).filter(part => part !== null)
  
  // If only one element and it's a string, return it directly
  if (result.length === 1 && typeof result[0] === 'string') {
    return result[0]
  }
  
  // Otherwise return the array (React can handle arrays of elements)
  return result
}

// Function to process text with multiple formatting options
export const formatText = (text) => {
  if (!text || typeof text !== 'string') return text
  
  // First handle bold text
  const withBold = parseMarkdownBold(text)
  
  // If it's already an array (has bold), return it
  if (Array.isArray(withBold)) return withBold
  
  // Otherwise return the text as is
  return withBold
}