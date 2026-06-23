import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { pdfAPI, summaryAPI } from '../services/api'
import { Upload, FileText, Loader, Star, Send, ChevronDown, ChevronUp, Bookmark } from 'lucide-react'

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
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 16,
          padding: '56px 24px',
          textAlign: 'center',
          cursor: loading ? 'default' : 'pointer',
          background: dragging ? 'var(--accent-soft)' : 'var(--bg2)',
          transition: 'all 0.2s ease',
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Loader size={32} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
            <div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Summarizing PDF...</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Analyzing document structure...</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
              <Upload size={24} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Drop your PDF here</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>or click to browse · max 10MB</div>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div style={{ marginTop: 12, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--danger)' }}>
          {error}
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

  if (submitted) return <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Thanks for your feedback ✓</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3,4,5].map(n => (
          <Star key={n} size={20}
            fill={(hovered || 0) >= n ? 'var(--accent)' : 'transparent'}
            color={(hovered || 0) >= n ? 'var(--accent)' : 'var(--text-muted)'}
            style={{ cursor: 'pointer', transition: 'all 0.1s' }}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => !loading && submit(n)}
          />
        ))}
      </div>
      <input className="input" placeholder="Optional feedback..." value={feedback} onChange={e => setFeedback(e.target.value)} style={{ fontSize: 13, padding: '8px 12px' }} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" placeholder="Ask a question about this PDF..." value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} />
        <button className="btn btn-primary" onClick={ask} disabled={loading} style={{ whiteSpace: 'nowrap', padding: '10px 16px' }}>
          {loading ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
        </button>
      </div>
      {answer && (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
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
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 15 }}>{data.fileName}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{new Date(data.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button 
            className="btn btn-ghost" 
            style={{ padding: '6px 10px', color: isSaved ? 'var(--accent)' : 'var(--text-muted)' }} 
            onClick={handleSave}
            disabled={saving}
          >
            <Bookmark size={16} fill={isSaved ? 'var(--accent)' : 'transparent'} />
          </button>
          <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => setOpen(o => !o)}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Summary</div>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)' }}>{parsed.summary}</p>
          </div>

          <div className="divider" style={{ margin: '4px 0' }} />

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Key points</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {parsed.keyPoints?.map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 600, flexShrink: 0, marginTop: 1 }}>→</span> {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="divider" style={{ margin: '4px 0' }} />

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Follow-up questions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {parsed.followUpQuestions?.map((q, i) => (
                <div key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  {q}
                </div>
              ))}
            </div>
          </div>

          <div className="divider" style={{ margin: '4px 0' }} />

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Ask this PDF</div>
            <QABox summaryId={data.summaryId} />
          </div>

          <div className="divider" style={{ margin: '4px 0' }} />

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Rate this summary</div>
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
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={16} color="var(--text-muted)" />
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{s.file_name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(s.created_at).toLocaleDateString()}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {s.rating && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}><Star size={13} fill="var(--accent)" color="var(--accent)" />{s.rating}</div>}
          
          <button 
            className="btn btn-ghost" 
            style={{ padding: '5px 8px', color: s.is_saved ? 'var(--accent)' : 'var(--text-muted)' }} 
            onClick={handleSave}
            disabled={saving}
          >
            <Bookmark size={14} fill={s.is_saved ? 'var(--accent)' : 'transparent'} />
          </button>

          <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 13 }} onClick={load}>
            {loading ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>
      {open && parsed && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{parsed.summary}</p>
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
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="page-wrapper" style={{ padding: '48px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <FileText size={18} color="var(--accent)" />
            <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.4px' }}>
              Good to see you, {user.name?.split(' ')[0]}
            </h1>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Upload a PDF to get started or view your past summaries below.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>New summary</div>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 4 }}>
              <button 
                onClick={() => setActiveTab('all')} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  borderBottom: `2px solid ${activeTab === 'all' ? 'var(--accent)' : 'transparent'}`, 
                  color: activeTab === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  paddingBottom: 6, 
                  fontWeight: activeTab === 'all' ? 600 : 400,
                  cursor: 'pointer',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  transition: 'all 0.2s'
                }}
              >
                All Uploads {pastSummaries.length > 0 && `(${pastSummaries.length})`}
              </button>
              <button 
                onClick={() => setActiveTab('saved')} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  borderBottom: `2px solid ${activeTab === 'saved' ? 'var(--accent)' : 'transparent'}`, 
                  color: activeTab === 'saved' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  paddingBottom: 6, 
                  fontWeight: activeTab === 'saved' ? 600 : 400,
                  cursor: 'pointer',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  transition: 'all 0.2s'
                }}
              >
                Bookmarked {savedSummaries.length > 0 && `(${savedSummaries.length})`}
              </button>
            </div>

            {loadingHistory ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <Loader size={20} color="var(--text-muted)" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : displayedSummaries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)', fontSize: 14 }}>
                {activeTab === 'all' ? 'No summaries yet. Upload your first PDF!' : 'No bookmarked summaries yet. Star some to save them here!'}
              </div>
            ) : (
              displayedSummaries.map(s => <PastSummaryCard key={s.id} s={s} onSaveToggle={fetchHistory} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
