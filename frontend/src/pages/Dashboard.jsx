import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { pdfAPI, summaryAPI } from '../services/api'
import { Upload, FileText, Loader, Send, ChevronDown, ChevronUp, Bookmark } from 'lucide-react'

function UploadZone({ onSuccess }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('pdf', file)
      const res = await pdfAPI.upload(formData)
      onSuccess(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <div
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `4px dashed ${dragging ? '#1040C0' : '#121212'}`,
          borderRadius: 0,
          padding: '56px 24px',
          textAlign: 'center',
          cursor: loading ? 'default' : 'pointer',
          background: dragging ? '#EAEAEA' : '#FFFFFF',
          transition: 'all 0.15s ease',
          boxShadow: '6px 6px 0px 0px #121212'
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#D02020', border: '2px solid #121212', animation: 'spin 1.5s linear infinite' }} />
              <div style={{ width: 14, height: 14, background: '#1040C0', border: '2px solid #121212', animation: 'spin 1.5s linear infinite' }} />
              <div style={{ 
                width: 0, height: 0, 
                borderLeft: '7px solid transparent', 
                borderRight: '7px solid transparent', 
                borderBottom: '14px solid #F0C020',
                position: 'relative',
                animation: 'spin 1.5s linear infinite'
              }}>
                <div style={{
                  position: 'absolute', top: 1, left: -7,
                  width: 0, height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderBottom: '14px solid #121212',
                  zIndex: -1
                }} />
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: 4, fontSize: 14, letterSpacing: '0.05em' }}>SUMMARIZING PDF DOCUMENT...</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7A7A7A', textTransform: 'uppercase' }}>Analyzing structure & extracting text</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ 
              width: 56, 
              height: 56, 
              background: '#F0C020', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: '4px solid #121212',
              boxShadow: '3px 3px 0px 0px #121212'
            }}>
              <Upload size={24} color="#121212" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>DROP YOUR PDF HERE</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7A7A7A', textTransform: 'uppercase' }}>or click to browse · max 10MB</div>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div style={{ 
          marginTop: 16, 
          background: 'rgba(208,32,32,0.08)', 
          border: '4px solid #D02020', 
          padding: '12px 16px', 
          fontSize: 13, 
          color: '#D02020',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          ERROR: {error}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function StarRating({ summaryId, current, onRated }) {
  const [hovered, setHovered] = useState(0)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(!!current)

  const submit = async (rating) => {
    setLoading(true)
    try {
      await summaryAPI.rate(summaryId, { rating, feedback })
      setSubmitted(true)
      onRated(rating)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return <div style={{ fontSize: 13, fontWeight: 900, color: '#1040C0', textTransform: 'uppercase' }}>Thanks for your feedback ✓</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            style={{
              width: 36,
              height: 36,
              border: '3px solid #121212',
              background: (hovered || 0) >= n ? '#F0C020' : '#FFFFFF',
              fontWeight: 900,
              color: '#121212',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.1s'
            }}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => !loading && submit(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <input 
        className="input" 
        placeholder="OPTIONAL FEEDBACK..." 
        value={feedback} 
        onChange={e => setFeedback(e.target.value)} 
        style={{ fontSize: 13, padding: '12px 14px', borderRadius: 0, border: '4px solid #121212', textTransform: 'uppercase', fontWeight: 700 }} 
      />
    </div>
  )
}

function QABox({ summaryId }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const ask = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer('')
    try {
      const res = await summaryAPI.ask(summaryId, question)
      setAnswer(res.data.answer)
    } catch (err) {
      setAnswer('Could not get an answer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="qa-row" style={{ display: 'flex', gap: 8 }}>
        <input 
          className="input" 
          placeholder="ASK A QUESTION ABOUT THIS PDF..." 
          value={question} 
          onChange={e => setQuestion(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && ask()} 
          style={{ borderRadius: 0, border: '4px solid #121212', fontWeight: 700, textTransform: 'uppercase' }}
        />
        <button 
          className="btn btn-primary" 
          onClick={ask} 
          disabled={loading} 
          style={{ whiteSpace: 'nowrap', padding: '12px 20px', borderRadius: 0 }}
        >
          {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
        </button>
      </div>
      {answer && (
        <div style={{ 
          background: '#EAEAEA', 
          border: '4px solid #121212', 
          borderLeft: '12px solid #1040C0', // Blue stripe for answers
          borderRadius: 0, 
          padding: '16px', 
          fontSize: 14, 
          color: '#121212', 
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: '#7A7A7A', marginBottom: 8, letterSpacing: '0.05em' }}>SYSTEM RESPONSE</div>
          {answer}
        </div>
      )}
    </div>
  )
}

function SummaryResult({ data, isSaved, onSaveToggle, onRated }) {
  const [open, setOpen] = useState(true)
  const [saving, setSaving] = useState(false)
  const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result

  const handleSave = async () => {
    setSaving(true)
    try {
      await summaryAPI.toggleSave(data.summaryId)
      onSaveToggle()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24, background: '#FFFFFF', border: '4px solid #121212', borderRadius: 0, boxShadow: '8px 8px 0px 0px #121212' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, background: '#D02020', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #121212', boxShadow: '2px 2px 0px 0px #121212' }}>
            <FileText size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: '#121212', textTransform: 'uppercase' }}>{data.fileName}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7A7A7A', marginTop: 2 }}>{new Date(data.createdAt).toLocaleString().toUpperCase()}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button 
            className="btn btn-ghost" 
            style={{ padding: '8px 12px', border: '3px solid #121212', color: isSaved ? '#D02020' : '#121212', boxShadow: 'none', borderRadius: 0 }} 
            onClick={handleSave}
            disabled={saving}
          >
            <Bookmark size={16} fill={isSaved ? '#D02020' : 'transparent'} />
          </button>
          <button 
            className="btn btn-ghost" 
            style={{ padding: '8px 12px', border: '3px solid #121212', boxShadow: 'none', borderRadius: 0 }} 
            onClick={() => setOpen(o => !o)}
          >
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div style={{ height: 4, background: '#121212', margin: '4px 0' }} />

          <div>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7A7A', marginBottom: 12 }}>SUMMARY PROFILE</div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#121212', fontWeight: 500 }}>{parsed.summary}</p>
          </div>

          <div style={{ height: 4, background: '#121212', margin: '4px 0' }} />

          <div>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7A7A', marginBottom: 12 }}>KEY EXTRACTED POINTS</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {parsed.keyPoints?.map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, fontSize: 14, color: '#121212', lineHeight: 1.5, fontWeight: 500 }}>
                  <span style={{ color: '#D02020', fontWeight: 900, flexShrink: 0 }}>■</span> {pt}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ height: 4, background: '#121212', margin: '4px 0' }} />

          <div>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7A7A', marginBottom: 12 }}>SUGGESTED QUESTIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {parsed.followUpQuestions?.map((q, i) => (
                <div key={i} style={{ fontSize: 13, fontWeight: 700, color: '#121212', padding: '12px 16px', background: '#EAEAEA', border: '3px solid #121212', textTransform: 'uppercase' }}>
                  {q}
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 4, background: '#121212', margin: '4px 0' }} />

          <div>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7A7A', marginBottom: 12 }}>INTERACTIVE QUERY SYSTEM</div>
            <QABox summaryId={data.summaryId} />
          </div>

          <div style={{ height: 4, background: '#121212', margin: '4px 0' }} />

          <div>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7A7A', marginBottom: 12 }}>RATE SUMMARY VALUE</div>
            <StarRating summaryId={data.summaryId} current={null} onRated={onRated} />
          </div>
        </>
      )}
    </div>
  )
}

function PastSummaryCard({ s, onSaveToggle }) {
  const [open, setOpen] = useState(false)
  const [full, setFull] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    if (full) { setOpen(o => !o); return }
    setLoading(true)
    try {
      const res = await summaryAPI.getById(s.id)
      setFull(res.data)
      setOpen(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await summaryAPI.toggleSave(s.id)
      onSaveToggle()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const parsed = full ? (typeof full.summary === 'string' ? JSON.parse(full.summary) : full.summary) : null

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#FFFFFF', border: '4px solid #121212', borderRadius: 0, boxShadow: '4px 4px 0px 0px #121212' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FileText size={18} color="#121212" />
          <div>
            <div style={{ fontWeight: 900, fontSize: 14, textTransform: 'uppercase', color: '#121212' }}>{s.file_name}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7A7A7A' }}>{new Date(s.created_at).toLocaleDateString().toUpperCase()}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {s.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 900, color: '#121212', background: '#F0C020', border: '2px solid #121212', padding: '2px 8px' }}>
              RATING: {s.rating}/5
            </div>
          )}
          
          <button 
            className="btn btn-ghost" 
            style={{ padding: '6px 8px', border: '3px solid #121212', color: s.is_saved ? '#D02020' : '#121212', boxShadow: 'none', borderRadius: 0 }} 
            onClick={handleSave}
            disabled={saving}
          >
            <Bookmark size={14} fill={s.is_saved ? '#D02020' : 'transparent'} />
          </button>

          <button 
            className="btn btn-ghost" 
            style={{ padding: '6px 10px', fontSize: 12, border: '3px solid #121212', boxShadow: 'none', borderRadius: 0 }} 
            onClick={load}
          >
            {loading ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>
      {open && parsed && (
        <div style={{ borderTop: '4px solid #121212', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: '#121212', lineHeight: 1.6, fontWeight: 500 }}>{parsed.summary}</p>
          <div style={{ height: 4, background: '#121212', margin: '4px 0' }} />
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7A7A' }}>INTERACTIVE QUERY SYSTEM</div>
          <QABox summaryId={s.id} />
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [latestResult, setLatestResult] = useState(null)
  const [pastSummaries, setPastSummaries] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const fetchHistory = () => {
    summaryAPI.getMy().then(res => setPastSummaries(res.data)).catch(console.error).finally(() => setLoadingHistory(false))
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleUploadSuccess = (data) => {
    setLatestResult(data)
    fetchHistory()
  }

  const isLatestSaved = latestResult ? pastSummaries.find(s => s.id === latestResult.summaryId)?.is_saved : false
  const savedSummaries = pastSummaries.filter(s => s.is_saved)
  const displayedSummaries = activeTab === 'all' ? pastSummaries : savedSummaries

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F0F0F0' }}>
      <Navbar />
      <div className="dash-wrapper" style={{ padding: '48px 48px', flexGrow: 1 }}>
        
        {/* Welcome Block */}
        <div className="dash-welcome" style={{ 
          background: '#FFFFFF', 
          border: '4px solid #121212', 
          padding: '24px 32px', 
          marginBottom: 40,
          boxShadow: '6px 6px 0px 0px #121212',
          position: 'relative'
        }}>
          {/* Bauhaus colorful tags on top right */}
          <div style={{ position: 'absolute', top: 0, right: 32, display: 'flex' }}>
            <div style={{ width: 24, height: 16, background: '#D02020', borderLeft: '4px solid #121212', borderBottom: '4px solid #121212' }} />
            <div style={{ width: 24, height: 16, background: '#1040C0', borderLeft: '4px solid #121212', borderBottom: '4px solid #121212' }} />
            <div style={{ width: 24, height: 16, background: '#F0C020', borderLeft: '4px solid #121212', borderBottom: '4px solid #121212', borderRight: '4px solid #121212' }} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1.5px', color: '#121212', textTransform: 'uppercase', margin: 0 }}>
              Good to see you, {user.name?.split(' ')[0]}
            </h1>
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#4E4E4E', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
            Upload a PDF to get started or view your past summaries below.
          </p>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
          
          {/* Left Column: Upload and Latest Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A7A7A' }}>
              [01] NEW DOCUMENT ANALYZER
            </div>
            <UploadZone onSuccess={handleUploadSuccess} />
            {latestResult && (
              <SummaryResult 
                data={latestResult} 
                isSaved={isLatestSaved} 
                onSaveToggle={fetchHistory} 
                onRated={fetchHistory} 
              />
            )}
          </div>

          {/* Right Column: History List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A7A7A' }}>
              [02] SUMMARIZATION LOGS
            </div>

            {/* Bauhaus Tab Controls */}
            <div style={{ display: 'flex', border: '4px solid #121212', boxShadow: '4px 4px 0px 0px #121212' }}>
              <button 
                onClick={() => setActiveTab('all')} 
                style={{ 
                  flex: 1,
                  background: activeTab === 'all' ? '#1040C0' : '#FFFFFF', 
                  color: activeTab === 'all' ? '#FFFFFF' : '#121212', 
                  border: 'none',
                  borderRight: '4px solid #121212',
                  padding: '16px', 
                  fontWeight: 900,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.1s'
                }}
              >
                All Uploads {pastSummaries.length > 0 && `(${pastSummaries.length})`}
              </button>
              <button 
                onClick={() => setActiveTab('saved')} 
                style={{ 
                  flex: 1,
                  background: activeTab === 'saved' ? '#1040C0' : '#FFFFFF', 
                  color: activeTab === 'saved' ? '#FFFFFF' : '#121212', 
                  border: 'none',
                  padding: '16px', 
                  fontWeight: 900,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.1s'
                }}
              >
                Bookmarked {savedSummaries.length > 0 && `(${savedSummaries.length})`}
              </button>
            </div>

            {/* List */}
            {loadingHistory ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D02020', border: '2px solid #121212', animation: 'spin 1s linear infinite' }} />
                  <div style={{ width: 10, height: 10, background: '#1040C0', border: '2px solid #121212', animation: 'spin 1s linear infinite' }} />
                </div>
              </div>
            ) : displayedSummaries.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '64px 32px', 
                color: '#7A7A7A', 
                fontSize: 14, 
                fontWeight: 700, 
                textTransform: 'uppercase',
                border: '4px solid #121212',
                background: '#FFFFFF',
                boxShadow: '4px 4px 0px 0px #121212'
              }}>
                {activeTab === 'all' ? 'No summaries yet. Upload your first PDF!' : 'No bookmarked summaries yet. Star some to save them here!'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {displayedSummaries.map(s => <PastSummaryCard key={s.id} s={s} onSaveToggle={fetchHistory} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

