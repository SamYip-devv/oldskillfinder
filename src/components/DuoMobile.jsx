import React, { useState, useEffect } from 'react'
import { Shield, CheckCircle, X, Lock, Smartphone } from 'lucide-react'

const DuoMobile = ({ onClose, onVerify }) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return // Only allow single digit
    
    const newCode = [...code]
    newCode[index] = value.replace(/\D/g, '') // Only numbers
    setCode(newCode)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]
    for (let i = 0; i < 6; i++) {
      newCode[i] = pastedData[i] || ''
    }
    setCode(newCode)
    if (pastedData.length === 6) {
      document.getElementById('code-5')?.focus()
    }
  }

  const handleVerify = async () => {
    const fullCode = code.join('')
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsVerifying(true)
    setError('')

    // Simulate verification delay
    setTimeout(() => {
      // For demo purposes, accept any 6-digit code
      // In real implementation, this would verify against Duo API
      setIsVerifying(false)
      setIsVerified(true)
      
      setTimeout(() => {
        if (onVerify) onVerify()
        if (onClose) onClose()
      }, 1000)
    }, 1500)
  }

  useEffect(() => {
    // Auto-focus first input
    document.getElementById('code-0')?.focus()
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        {/* Duo Mobile Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Duo Mobile</h2>
                <p className="text-sm text-blue-100">Two-Factor Authentication</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isVerified ? (
            <>
              {/* Phone Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-orange-50 rounded-full p-6">
                  <Smartphone className="w-16 h-16 text-orange-600" />
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Enter the 6-digit code
                </h3>
                <p className="text-sm text-gray-600">
                  Open Duo Mobile on your device and enter the verification code
                </p>
              </div>

              {/* Code Input */}
              <div className="mb-6">
                <div className="flex justify-center space-x-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-red-600 text-sm text-center mt-2">{error}</p>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={isVerifying || code.join('').length !== 6}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Verify</span>
                  </>
                )}
              </button>

              {/* Help Text */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Don't have access to your device?{' '}
                  <a href="#" className="text-orange-600 hover:underline">
                    Use a backup code
                  </a>
                </p>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Verification Successful
              </h3>
              <p className="text-sm text-gray-600">
                You have been authenticated successfully
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Powered by Duo Security</span>
            <span>Secure Login</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DuoMobile

