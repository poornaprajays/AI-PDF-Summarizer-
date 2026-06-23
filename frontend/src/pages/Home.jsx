import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Sparkles, FileText, Zap, MessageSquare, Star, ArrowRight, Shield } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Instant summaries', desc: 'Process your PDF in seconds and get a clean, high-fidelity summary.' },
  { icon: MessageSquare, title: 'Ask anything', desc: 'Chat with your document. Ask follow-up questions and get answers grounded in your PDF.' },
  { icon: Star, title: 'Key points', desc: 'Five bullet-point takeaways extracted automatically so you never miss what matters.' },
  { icon: Shield, title: 'Private & secure', desc: 'Your files are deleted immediately after summarization. Never stored.' },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '100px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <h1 className="serif" style={{
            fontSize: 'clamp(40px, 6vw, 68px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            marginBottom: 24,
            color: 'var(--text-primary)',
            marginTop: 24,
          }}>
            Read less.<br />
            <span style={{ color: 'var(--accent)' }}>Understand more.</span>
          </h1>
          <p style={{
            fontSize: 18, color: 'var(--text-secondary)',
            lineHeight: 1.7, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px',
          }}>
            Drop any PDF. Get a crisp summary, key points, and the ability to ask questions — in seconds.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button className="btn btn-primary" style={{ padding: '13px 28px', fontSize: 15 }}>
                Start for free <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-ghost" style={{ padding: '13px 28px', fontSize: 15 }}>
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '28px 24px' }}>
        <div style={{
          maxWidth: 700, margin: '0 auto',
          display: 'flex', justifyContent: 'space-around',
          flexWrap: 'wrap', gap: 24,
        }}>
          {[['10MB', 'Max file size'], ['< 5s', 'Avg summary time'], ['Free', 'To get started']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{val}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 13, fontWeight: 500, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 48 }}>
          Everything you need
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'var(--accent-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--border)',
              }}>
                <Icon size={18} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 100px' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto', textAlign: 'center',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '56px 40px',
        }}>
          <h2 className="serif" style={{ fontSize: 36, fontWeight: 400, marginBottom: 16, letterSpacing: '-0.5px' }}>
            Ready to summarize?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15 }}>
            No credit card. No setup. Just drop your PDF and go.
          </p>
          <Link to="/register">
            <button className="btn btn-primary" style={{ padding: '13px 32px', fontSize: 15 }}>
              Get started free <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          © 2026 Summarize
        </span>
      </footer>
    </div>
  )
}
