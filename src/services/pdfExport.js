import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { formatText } from '../utils/textFormatting.jsx'

// Export service - creates downloadable PDF from recommendations
export const exportToFile = async (recommendations, format = 'pdf') => {
  try {
    if (format === 'pdf') {
      await generatePDF(recommendations)
    } else if (format === 'html') {
      generateHTML(recommendations)
    } else if (format === 'txt') {
      generateText(recommendations)
    }
  } catch (error) {
    console.error('Export failed:', error)
    throw new Error('Failed to export file. Please try again.')
  }
}

const generatePDF = async (recommendations) => {
  // Create a temporary container for rendering
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.width = '794px' // A4 width in pixels at 96 DPI
  container.style.backgroundColor = 'white'
  container.style.padding = '20px' // Reduced padding for more content space
  container.style.fontFamily = 'Arial, sans-serif'
  
  // Generate beautiful content
  container.innerHTML = generatePDFContent(recommendations)
  document.body.appendChild(container)
  
  try {
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Get all sections and items
    const sections = container.querySelectorAll('.pdf-section')
    const skillItems = container.querySelectorAll('.skill-item')
    const careerItems = container.querySelectorAll('.career-item')
    
    let currentY = 10 // Starting Y position in mm
    const pageHeight = pdf.internal.pageSize.getHeight()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 10 // 10mm margins
    const contentWidth = pageWidth - (2 * margin)
    
    // Process each section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      
      // Special handling for cover page - don't add extra page before it
      if (section.classList.contains('cover-page')) {
        const canvas = await html2canvas(section, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true
        })
        
        const imgData = canvas.toDataURL('image/png')
        const imgHeight = (canvas.height * contentWidth) / canvas.width
        
        pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, imgHeight)
        currentY = margin
        continue
      }
      
      // Special handling for skills and careers sections
      if (section.classList.contains('skills-section')) {
        // Always start skills section on a new page
        if (i > 0) {
          pdf.addPage()
          currentY = margin
        }
        
        // Add section header
        const header = section.querySelector('.section-header')
        if (header) {
          const headerCanvas = await html2canvas(header, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
          })
          const headerImgData = headerCanvas.toDataURL('image/png')
          const headerHeight = (headerCanvas.height * contentWidth) / headerCanvas.width
          
          pdf.addImage(headerImgData, 'PNG', margin, currentY, contentWidth, headerHeight)
          currentY += headerHeight + 5
        }
        
        // Process each skill item separately
        const items = section.querySelectorAll('.skill-item')
        for (const item of items) {
          const itemCanvas = await html2canvas(item, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
          })
          const itemImgData = itemCanvas.toDataURL('image/png')
          const itemHeight = (itemCanvas.height * contentWidth) / itemCanvas.width
          
          // Check if item fits on current page
          if (currentY + itemHeight > pageHeight - margin) {
            pdf.addPage()
            currentY = margin
          }
          
          pdf.addImage(itemImgData, 'PNG', margin, currentY, contentWidth, itemHeight)
          currentY += itemHeight + 3 // Small gap between items
        }
      } else if (section.classList.contains('careers-section')) {
        // Always start careers section on a new page
        if (i > 0) {
          pdf.addPage()
          currentY = margin
        }
        
        // Similar handling for career paths
        const header = section.querySelector('.section-header')
        if (header) {
          const headerCanvas = await html2canvas(header, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
          })
          const headerImgData = headerCanvas.toDataURL('image/png')
          const headerHeight = (headerCanvas.height * contentWidth) / headerCanvas.width
          
          pdf.addImage(headerImgData, 'PNG', margin, currentY, contentWidth, headerHeight)
          currentY += headerHeight + 5
        }
        
        const items = section.querySelectorAll('.career-item')
        for (const item of items) {
          const itemCanvas = await html2canvas(item, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
          })
          const itemImgData = itemCanvas.toDataURL('image/png')
          const itemHeight = (itemCanvas.height * contentWidth) / itemCanvas.width
          
          if (currentY + itemHeight > pageHeight - margin) {
            pdf.addPage()
            currentY = margin
          }
          
          pdf.addImage(itemImgData, 'PNG', margin, currentY, contentWidth, itemHeight)
          currentY += itemHeight + 3
        }
      } else {
        // Regular sections - render as whole
        // Always add a new page for sections that have page-break-before
        pdf.addPage()
        currentY = margin
        
        const canvas = await html2canvas(section, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true
        })
        
        const imgData = canvas.toDataURL('image/png')
        const imgHeight = (canvas.height * contentWidth) / canvas.width
        
        pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, imgHeight)
        currentY = margin // Reset for next page
      }
    }
    
    // Save PDF
    const fileName = `skillfinder-analysis-${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
    
  } finally {
    // Clean up
    document.body.removeChild(container)
  }
}

const generatePDFContent = (recommendations) => {
  const processText = (text) => {
    if (!text) return ''
    // Convert markdown bold to HTML
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }
  
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
      <!-- Cover Page -->
      <div class="pdf-section cover-page" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 40px;">
        <h1 style="font-size: 48px; font-weight: 800; margin: 0; color: #2d3748;">SkillFinder Analysis Report</h1>
        <p style="font-size: 18px; color: #718096; margin: 20px 0;">Your Personalized Career & Skills Discovery</p>
        <div style="width: 100px; height: 2px; background: linear-gradient(90deg, #667eea, #764ba2); margin: 40px auto;"></div>
        <p style="font-size: 14px; color: #a0aec0;">Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div style="margin-top: 60px; padding: 20px; background: #f7fafc; border-radius: 12px;">
          <p style="font-size: 12px; color: #718096; margin: 0;">Powered by SkillFinder AI</p>
          <p style="font-size: 11px; color: #a0aec0; margin: 5px 0 0 0;">Personality-Based Career Discovery Platform</p>
        </div>
      </div>
      
      <!-- Profile Summary -->
      ${recommendations.profileSummary ? `
        <div class="pdf-section" style="padding: 40px; page-break-before: always;">
          <h2 style="font-size: 32px; font-weight: 700; color: #2d3748; margin: 0 0 30px 0; border-bottom: 3px solid #667eea; padding-bottom: 15px; letter-spacing: 0.5px;">Your Profile Summary</h2>
          <div style="background: #f7fafc; padding: 30px; border-radius: 12px; border-left: 4px solid #667eea;">
            <p style="font-size: 16px; line-height: 1.8; color: #4a5568; white-space: pre-line; margin: 0;">
              ${processText(recommendations.profileSummary)}
            </p>
          </div>
        </div>
      ` : ''}
      
      <!-- Core Profile -->
      ${recommendations.coreProfile ? `
        <div class="pdf-section" style="padding: 30px 20px; page-break-before: always;">
          <h2 style="font-size: 28px; font-weight: 700; color: #2d3748; margin: 0 0 20px 0; border-bottom: 3px solid #667eea; padding-bottom: 12px; letter-spacing: 0.5px;">Your Core Profile: ${recommendations.coreProfile.title}</h2>
          <div style="background: linear-gradient(135deg, #edf2f7 0%, #e9d8fd 100%); padding: 20px; border-radius: 10px;">
            ${recommendations.coreProfile.traits?.map((trait, index) => `
              <div style="background: rgba(255,255,255,0.8); padding: 12px 16px; margin-bottom: ${index < recommendations.coreProfile.traits.length - 1 ? '12px' : '0'}; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                  <strong style="color: #4c1d95;">${trait.category}:</strong> ${processText(trait.description)}
                </p>
                <p style="margin: 6px 0 0 0; font-size: 11px; color: #718096; font-style: italic;">
                  (${trait.evidence})
                </p>
              </div>
            `).join('') || ''}
          </div>
        </div>
      ` : ''}
      
      <!-- Recommended Skills -->
      ${recommendations.skills && recommendations.skills.length > 0 ? `
        <div class="pdf-section skills-section" style="padding: 20px; page-break-before: always;">
          <div class="section-header">
            <h2 style="font-size: 28px; font-weight: 700; color: #2d3748; margin: 0 0 20px 0; border-bottom: 3px solid #667eea; padding-bottom: 15px; letter-spacing: 0.5px;">Recommended Hard Skills</h2>
          </div>
          ${recommendations.skills.map((skill, index) => `
            <div class="skill-item" style="background: linear-gradient(135deg, #e9d8fd 0%, #edf2f7 100%); padding: 20px; margin-bottom: 15px; border-radius: 12px; border: 1px solid #d6bcfa;">
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h3 style="font-size: 20px; font-weight: 600; color: #2d3748; margin: 0;">${skill.name}</h3>
                  <span style="background: #667eea; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; white-space: nowrap;">
                    ${skill.match || 85}% Match
                  </span>
                </div>
              </div>
              <p style="font-size: 14px; color: #4a5568; line-height: 1.7; margin: 0 0 12px 0;">
                ${processText(skill.description)}
              </p>
              ${skill.personalityAlignment ? `
                <div style="background: rgba(255,255,255,0.7); padding: 12px; border-radius: 8px;">
                  <p style="margin: 0; font-size: 13px; color: #2d3748;">
                    <strong>Why this suits your personality:</strong>
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 12px; color: #4a5568; line-height: 1.5;">
                    ${processText(skill.personalityAlignment)}
                  </p>
                </div>
              ` : ''}
              ${skill.gettingStarted ? `
                <div style="background: #d6f5d6; padding: 12px; border-radius: 8px; margin-top: 10px; border: 1px solid #9ae6b4;">
                  <p style="margin: 0; font-size: 13px; color: #22543d;">
                    <strong>Getting Started:</strong>
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 12px; color: #2f855a; line-height: 1.5;">
                    ${processText(skill.gettingStarted)}
                  </p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Career Paths -->
      ${recommendations.careerPaths && recommendations.careerPaths.length > 0 ? `
        <div class="pdf-section careers-section" style="padding: 20px; page-break-before: always;">
          <div class="section-header">
            <h2 style="font-size: 28px; font-weight: 700; color: #2d3748; margin: 0 0 20px 0; border-bottom: 3px solid #667eea; padding-bottom: 15px; letter-spacing: 0.5px;">Recommended Career Paths</h2>
          </div>
          ${recommendations.careerPaths.map((career, index) => `
            <div class="career-item" style="background: #f7fafc; padding: 20px; margin-bottom: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h3 style="font-size: 20px; font-weight: 600; color: #2d3748; margin: 0;">${career.name}</h3>
                  <span style="background: #5a3ca8; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; white-space: nowrap;">
                    ${career.match || 85}% Match
                  </span>
                </div>
              </div>
              <p style="font-size: 15px; color: #4a5568; line-height: 1.6; margin: 0 0 15px 0;">
                ${processText(career.description)}
              </p>
              ${career.personalityAlignment ? `
                <div style="background: rgba(255,255,255,0.8); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                  <p style="margin: 0; font-size: 14px; color: #2d3748;">
                    <strong>Why this suits your personality:</strong>
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 13px; color: #4a5568; line-height: 1.5;">
                    ${processText(career.personalityAlignment)}
                  </p>
                </div>
              ` : ''}
              ${career.skillsNeeded ? `
                <div style="background: #fef5e7; padding: 15px; border-radius: 8px; border: 1px solid #fcd34d;">
                  <p style="margin: 0; font-size: 14px; color: #92400e;">
                    <strong>Key skills for this path:</strong>
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 13px; color: #b45309; line-height: 1.5;">
                    ${processText(career.skillsNeeded)}
                  </p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Skills to Avoid -->
      ${recommendations.skillsToAvoid && recommendations.skillsToAvoid.length > 0 ? `
        <div class="pdf-section" style="padding: 40px; page-break-before: always;">
          <h2 style="font-size: 32px; font-weight: 700; color: #2d3748; margin: 0 0 30px 0; border-bottom: 3px solid #e53e3e; padding-bottom: 15px; letter-spacing: 0.5px;">Skills to Avoid</h2>
          ${recommendations.skillsToAvoid.map((skill, index) => `
            <div style="background: #fff5f5; padding: 25px; margin-bottom: 25px; border-radius: 12px; border: 1px solid #feb2b2;">
              <h3 style="font-size: 22px; font-weight: 600; color: #c53030; margin: 0 0 15px 0;">${skill.name}</h3>
              <p style="font-size: 15px; color: #742a2a; line-height: 1.6; margin: 0 0 15px 0;">
                ${processText(skill.reason)}
              </p>
              ${skill.personalityMismatch ? `
                <div style="background: rgba(255,255,255,0.7); padding: 15px; border-radius: 8px;">
                  <p style="margin: 0; font-size: 14px; color: #742a2a;">
                    <strong>Personality mismatch:</strong>
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 13px; color: #c53030; line-height: 1.5;">
                    ${processText(skill.personalityMismatch)}
                  </p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Key Insights -->
      ${recommendations.insights ? `
        <div class="pdf-section" style="padding: 40px; page-break-before: always;">
          <h2 style="font-size: 32px; font-weight: 700; color: #2d3748; margin: 0 0 30px 0; border-bottom: 3px solid #667eea; padding-bottom: 15px; letter-spacing: 0.5px;">Key Insights</h2>
          <div style="background: #f7fafc; padding: 30px; border-radius: 12px; border-left: 4px solid #667eea;">
            <p style="font-size: 16px; line-height: 1.8; color: #4a5568; margin: 0;">
              ${processText(recommendations.insights)}
            </p>
          </div>
        </div>
      ` : ''}
      
      <!-- Your Next Steps -->
      ${recommendations.nextSteps && recommendations.nextSteps.length > 0 ? `
        <div class="pdf-section" style="padding: 40px; page-break-before: always;">
          <h2 style="font-size: 32px; font-weight: 700; color: #2d3748; margin: 0 0 30px 0; border-bottom: 3px solid #667eea; padding-bottom: 15px; letter-spacing: 0.5px;">Your Next Steps</h2>
          <div style="background: linear-gradient(135deg, #edf2f7 0%, #d6f5d6 100%); padding: 30px; border-radius: 12px;">
            ${recommendations.nextSteps.map((step, index) => `
              <div style="display: flex; align-items: flex-start; margin-bottom: ${index < recommendations.nextSteps.length - 1 ? '25px' : '0'};">
                <div style="background: #667eea; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; margin-right: 20px; flex-shrink: 0;">
                  ${index + 1}
                </div>
                <p style="margin: 0; color: #2d3748; font-size: 16px; line-height: 1.8; padding-top: 5px;">
                  ${processText(step)}
                </p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `
}

const generateHTML = (recommendations) => {
  const content = generateHTMLContent(recommendations)
  const blob = new Blob([content], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `personality-analysis-${new Date().toISOString().split('T')[0]}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

const generateText = (recommendations) => {
  const content = generateTextContent(recommendations)
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `personality-analysis-${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

const generateTextContent = (recommendations) => {
  let content = `PERSONALITY ANALYSIS REPORT
Generated on ${new Date().toLocaleDateString()}
========================================

`

  // Profile Summary
  if (recommendations.profileSummary) {
    content += `PROFILE SUMMARY
${'-'.repeat(50)}
${recommendations.profileSummary}

`
  }

  // Core Profile
  if (recommendations.coreProfile) {
    content += `YOUR CORE PROFILE: ${recommendations.coreProfile.title}
${'-'.repeat(50)}
`
    recommendations.coreProfile.traits?.forEach(trait => {
      content += `${trait.category}: ${trait.description}
Evidence: ${trait.evidence}

`
    })
  }

  // Skills
  if (recommendations.skills) {
    content += `RECOMMENDED HARD SKILLS
${'-'.repeat(50)}
`
    recommendations.skills.forEach((skill, index) => {
      content += `${index + 1}. ${skill.name} (${skill.match || 85}% Match)
${skill.description}

Why this suits your personality:
${skill.personalityAlignment || 'Analysis not available'}

${skill.gettingStarted ? `Getting Started:
${skill.gettingStarted}

` : ''}`
    })
  }

  // Career Paths
  if (recommendations.careerPaths) {
    content += `RECOMMENDED CAREER PATHS
${'-'.repeat(50)}
`
    recommendations.careerPaths.forEach((career, index) => {
      content += `${index + 1}. ${career.name} (${career.match || 85}% Match)
${career.description}

${career.personalityAlignment ? `Why this suits your personality:
${career.personalityAlignment}

` : ''}${career.skillsNeeded ? `Key skills needed:
${career.skillsNeeded}

` : ''}`
    })
  }

  // Skills to Avoid
  if (recommendations.skillsToAvoid) {
    content += `SKILLS TO AVOID
${'-'.repeat(50)}
`
    recommendations.skillsToAvoid.forEach((skill, index) => {
      content += `${index + 1}. ${skill.name}
Reason: ${skill.reason}
${skill.personalityMismatch ? `Personality mismatch: ${skill.personalityMismatch}` : ''}

`
    })
  }

  // Key Insights
  if (recommendations.insights) {
    content += `KEY INSIGHTS
${'-'.repeat(50)}
${recommendations.insights}

`
  }

  // Next Steps
  if (recommendations.nextSteps) {
    content += `RECOMMENDED NEXT STEPS
${'-'.repeat(50)}
`
    recommendations.nextSteps.forEach((step, index) => {
      content += `${index + 1}. ${step}
`
    })
  }

  content += `

Generated by Pathfinder - Personality-Based Career Discovery Platform
This report is based on your personality test results and AI analysis.`

  return content
}

const generateHTMLContent = (recommendations) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personality Analysis Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #f8f9fa;
        }
        .container {
            background: white;
            padding: 60px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }
        h1, h2, h3 {
            color: #2d3748;
        }
        h1 {
            font-size: 36px;
            margin-bottom: 40px;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        h2 {
            font-size: 28px;
            margin-top: 40px;
            margin-bottom: 20px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        .section {
            margin-bottom: 40px;
        }
        .card {
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
        }
        .skill-card {
            background: linear-gradient(135deg, #e9d8fd 0%, #edf2f7 100%);
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #d6bcfa;
        }
        .match-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Personality Analysis Report</h1>
        <p style="text-align: center; color: #718096; margin-bottom: 40px;">
            Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        ${generateHTMLSections(recommendations)}
        
        <div style="text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #9ca3af; font-size: 14px;">
                Generated by Pathfinder - Personality-Based Career Discovery Platform<br>
                This report is based on your personality test results and AI analysis.
            </p>
        </div>
    </div>
</body>
</html>
  `
}

const generateHTMLSections = (recommendations) => {
  let html = ''
  
  // Add each section based on available data
  if (recommendations.profileSummary) {
    html += `
      <div class="section">
        <h2>Profile Summary</h2>
        <div class="card">
          <p>${recommendations.profileSummary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
        </div>
      </div>
    `
  }
  
  if (recommendations.coreProfile) {
    html += `
      <div class="section">
        <h2>Your Core Profile: ${recommendations.coreProfile.title}</h2>
        <div class="card">
          ${recommendations.coreProfile.traits?.map(trait => `
            <p><strong>${trait.category}:</strong> ${trait.description}</p>
            <p style="font-size: 14px; color: #718096; margin-bottom: 20px;">(${trait.evidence})</p>
          `).join('') || ''}
        </div>
      </div>
    `
  }
  
  if (recommendations.skills && recommendations.skills.length > 0) {
    html += `
      <div class="section">
        <h2>Recommended Hard Skills</h2>
        ${recommendations.skills.map(skill => `
          <div class="skill-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h3 style="margin: 0;">${skill.name}</h3>
              <span class="match-badge">${skill.match || 85}% Match</span>
            </div>
            <p>${skill.description}</p>
            ${skill.personalityAlignment ? `
              <p style="font-size: 14px; color: #4a5568;">
                <strong>Why this suits you:</strong> ${skill.personalityAlignment}
              </p>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `
  }
  
  return html
}