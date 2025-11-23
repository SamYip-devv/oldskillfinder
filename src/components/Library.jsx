import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { BookOpen, Download, Copy, Check } from 'lucide-react'

const Library = () => {
  const [copied, setCopied] = useState(false)
  
  // Library entrance QR code data - you can customize this
  const libraryQRData = JSON.stringify({
    type: 'library_entrance',
    institution: 'Lingnan University',
    timestamp: new Date().toISOString(),
    accessCode: 'LIB-2025-ENTRANCE'
  })

  const handleDownload = () => {
    const container = document.getElementById('library-qr-code')
    if (!container) return

    const svg = container.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'library-entrance-qr-code.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const handleCopy = () => {
    const container = document.getElementById('library-qr-code')
    if (!container) return

    const svg = container.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const item = new ClipboardItem({ 'image/svg+xml': blob })
    
    navigator.clipboard.write([item]).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(err => {
      console.error('Failed to copy:', err)
      // Fallback: copy the QR data as text
      navigator.clipboard.writeText(libraryQRData).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    })
  }

  return (
    <div className="w-full">
      <div className="moodle-block mb-4">
        <div className="moodle-block-header">
          <h2 className="text-lg font-bold text-orange-700 flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Library</span>
          </h2>
        </div>
        <div className="moodle-block-content p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Library Entrance QR Code
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Scan this QR code at the library entrance for quick access
            </p>

            {/* QR Code Display */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-lg">
                <div id="library-qr-code">
                  <QRCodeSVG
                    value={libraryQRData}
                    size={256}
                    level="H"
                    includeMargin={true}
                    fgColor="#ea580c"
                    bgColor="#ffffff"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mb-6">
              <button
                onClick={handleDownload}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download QR Code</span>
              </button>
              <button
                onClick={handleCopy}
                className="btn-secondary flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Library Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">Library Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Opening Hours</p>
                  <p>Monday - Friday: 8:00 AM - 10:00 PM</p>
                  <p>Saturday - Sunday: 9:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Contact</p>
                  <p>Phone: (852) 2616-8586</p>
                  <p>Email: library@ln.edu.hk</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Location</p>
                  <p>Main Campus, Lingnan University</p>
                  <p>Tuen Mun, New Territories, Hong Kong</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Services</p>
                  <p>• Book borrowing & returns</p>
                  <p>• Study spaces & group rooms</p>
                  <p>• Research assistance</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">How to Use</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-orange-700">
                <li>Open this page on your mobile device</li>
                <li>Show the QR code to the library entrance scanner</li>
                <li>Or download the QR code image to your phone for offline use</li>
                <li>The QR code is valid for library entrance access</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Library

