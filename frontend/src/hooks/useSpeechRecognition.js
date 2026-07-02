import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useSpeechRecognition
 * Wraps the browser-native Web Speech API (SpeechRecognition / webkitSpeechRecognition).
 * Works in Chrome, Edge, and Safari. Returns null-safe state for unsupported browsers.
 *
 * @returns {{
 *   isSupported: boolean,
 *   isListening: boolean,
 *   transcript: string,
 *   interimTranscript: string,
 *   startListening: () => void,
 *   stopListening: () => void,
 *   resetTranscript: () => void,
 *   error: string|null
 * }}
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  // Detect browser support once on mount
  const SpeechRecognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null
  const isSupported = !!SpeechRecognition

  useEffect(() => {
    if (!isSupported) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false        // stop after one sentence (natural pause)
    recognition.interimResults = true     // show live partial transcription
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setInterimTranscript('')
    }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }
      if (final) {
        setTranscript(prev => (prev + ' ' + final).trim())
        setInterimTranscript('')
      } else {
        setInterimTranscript(interim)
      }
    }

    recognition.onerror = (event) => {
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          setError('Microphone access denied. Please allow mic permissions.')
          break
        case 'no-speech':
          setError('No speech detected. Please try again.')
          break
        case 'network':
          setError('Network error during recognition.')
          break
        default:
          setError(`Speech recognition error: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [isSupported]) // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return
    setError(null)
    setTranscript('')
    setInterimTranscript('')
    try {
      recognitionRef.current.start()
    } catch (err) {
      setError('Could not start speech recognition.')
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return
    recognitionRef.current.stop()
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
  }
}
