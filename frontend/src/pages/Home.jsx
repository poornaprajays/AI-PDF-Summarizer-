import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Zap, MessageSquare, Star, Shield, ArrowRight } from 'lucide-react'

const features = [
  { 
    icon: Zap, 
    title: 'Instant summaries', 
    desc: 'Process your PDF in seconds and get a clean, high-fidelity summary.',
    color: '#F0C020', // Yellow
    shape: 'circle'
  },
  { 
    icon: MessageSquare, 
    title: 'Ask anything', 
    desc: 'Chat with your document. Ask follow-up questions and get answers grounded in your PDF.',
    color: '#D02020', // Red
    shape: 'square'
  },
  { 
    icon: Star, 
    title: 'Key points', 
    desc: 'Five bullet-point takeaways extracted automatically so you never miss what matters.',
    color: '#1040C0', // Blue
    shape: 'triangle'
  },
  { 
    icon: Shield, 
    title: 'Private & secure', 
    desc: 'Your files are deleted immediately after summarization. Never stored.',
    color: '#FFFFFF', // White
    shape: 'cross'
  },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F0F0F0' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        borderBottom: '4px solid #121212',
        background: '#FFFFFF'
      }}>
        {/* Left Hero Panel */}
        <div className="hero-panel-left" style={{ 
          padding: '80px 48px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          borderRight: '4px solid #121212'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#F0C020',
            border: '2px solid #121212',
            padding: '4px 12px',
            fontWeight: 900,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            width: 'fit-content',
            marginBottom: 24
          }}>
            SYSTEM VERSION 1.0
          </div>
          <h1 style={{
            fontSize: 'clamp(44px, 7vw, 76px)',
            fontWeight: 900,
            lineHeight: '0.9',
            letterSpacing: '-2.5px',
            color: '#121212',
            marginBottom: 24,
            textTransform: 'uppercase'
          }}>
            Read less.<br />
            <span style={{ color: '#D02020' }}>Understand</span><br />
            <span style={{ color: '#1040C0' }}>More.</span>
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#4E4E4E',
            lineHeight: '1.4',
            marginBottom: 40,
            maxWidth: 520,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '-0.2px'
          }}>
            Drop any PDF. Get a crisp summary, key points, and chat with your documents instantly. No sparkles, no gimmicks. Just pure information.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/register">
              <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: 15 }}>
                Get started free <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-ghost" style={{ padding: '16px 32px', fontSize: 15 }}>
                Sign in
              </button>
            </Link>
          </div>
        </div>

        {/* Right Hero Panel: Interactive Bauhaus Geometric Composition */}
        <div className="hero-panel-right" style={{ 
          background: '#1040C0', 
          position: 'relative', 
          overflow: 'hidden', 
          minHeight: '450px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Constructivist background grid line */}
          <div style={{ position: 'absolute', width: '100%', height: 4, background: '#121212', top: '40%', left: 0 }} />
          <div style={{ position: 'absolute', width: 4, height: '100%', background: '#121212', left: '30%', top: 0 }} />
          <div style={{ position: 'absolute', width: 4, height: '100%', background: '#121212', left: '70%', top: 0 }} />
          
          {/* Yellow Circle */}
          <div style={{ 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            background: '#F0C020', 
            border: '6px solid #121212', 
            position: 'absolute', 
            top: '10%', 
            left: '12%',
            boxShadow: '8px 8px 0px 0px #121212'
          }} />

          {/* Red Square */}
          <div style={{ 
            width: 160, 
            height: 160, 
            background: '#D02020', 
            border: '6px solid #121212', 
            position: 'absolute', 
            bottom: '15%', 
            right: '15%',
            transform: 'rotate(15deg)',
            boxShadow: '8px 8px 0px 0px #121212'
          }} />

          {/* Stark White Graphic Document Block */}
          <div style={{ 
            width: 150, 
            height: 210, 
            background: '#FFFFFF', 
            border: '6px solid #121212', 
            position: 'absolute', 
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 16,
            boxShadow: '12px 12px 0px 0px #121212',
            transform: 'rotate(-5deg)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ width: '40%', height: 12, background: '#D02020', border: '2px solid #121212' }} />
              <div style={{ width: '85%', height: 6, background: '#121212' }} />
              <div style={{ width: '70%', height: 6, background: '#121212' }} />
              <div style={{ width: '90%', height: 6, background: '#121212' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1040C0', border: '3px solid #121212' }} />
              <span style={{ fontSize: 24, fontWeight: 900, color: '#121212', letterSpacing: '-1.5px', lineHeight: 1 }}>PDF</span>
            </div>
          </div>

          {/* Decorative small black solid circle */}
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#121212',
            position: 'absolute',
            top: '65%',
            left: '25%'
          }} />
        </div>
      </section>

      {/* Stats bar - Bauhaus Grid */}
      <section style={{ 
        borderBottom: '4px solid #121212', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        <div style={{ 
          background: '#F0C020', 
          color: '#121212', 
          padding: '40px 24px', 
          textAlign: 'center', 
          borderRight: '4px solid #121212'
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: '-2px', lineHeight: 1 }}>10MB</div>
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 12 }}>MAX FILE SIZE</div>
        </div>
        <div style={{ 
          background: '#FFFFFF', 
          color: '#121212', 
          padding: '40px 24px', 
          textAlign: 'center', 
          borderRight: '4px solid #121212'
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: '-2px', lineHeight: 1 }}>&lt; 5s</div>
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 12 }}>AVG SUMMARY TIME</div>
        </div>
        <div style={{ 
          background: '#D02020', 
          color: '#FFFFFF', 
          padding: '40px 24px', 
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: '-2px', lineHeight: 1 }}>FREE</div>
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 12 }}>TO GET STARTED</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ padding: '80px 48px', flexGrow: 1 }}>
        <div style={{ 
          borderBottom: '4px solid #121212', 
          paddingBottom: 24, 
          marginBottom: 48, 
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#121212', margin: 0 }}>EVERYTHING YOU NEED</h2>
          <div style={{ display: 'flex', gap: 8, paddingBottom: 6 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#D02020', border: '3px solid #121212' }} />
            <div style={{ width: 18, height: 18, background: '#1040C0', border: '3px solid #121212' }} />
            <div style={{ 
              width: 0, height: 0, 
              borderLeft: '9px solid transparent', 
              borderRight: '9px solid transparent', 
              borderBottom: '18px solid #F0C020',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute', top: 1, left: -9,
                width: 0, height: 0,
                borderLeft: '9px solid transparent',
                borderRight: '9px solid transparent',
                borderBottom: '18px solid #121212',
                zIndex: -1
              }} />
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: 32 
        }}>
          {features.map(({ icon: Icon, title, desc, color, shape }) => (
            <div 
              key={title} 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 20, 
                position: 'relative',
                background: '#FFFFFF'
              }}
            >
              {/* Asymmetrical Geometric Corner Flag */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 32,
                height: 32,
                background: color,
                borderBottom: '4px solid #121212',
                borderLeft: '4px solid #121212',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {shape === 'circle' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#121212' }} />}
                {shape === 'square' && <div style={{ width: 8, height: 8, background: '#121212' }} />}
                {shape === 'triangle' && (
                  <div style={{ 
                    width: 0, height: 0, 
                    borderLeft: '5px solid transparent', 
                    borderRight: '5px solid transparent', 
                    borderBottom: '9px solid #121212' 
                  }} />
                )}
                {shape === 'cross' && <div style={{ fontWeight: 900, fontSize: 10, color: '#121212' }}>+</div>}
              </div>

              <div style={{
                width: 50, 
                height: 50, 
                background: color,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '4px solid #121212',
                boxShadow: '3px 3px 0px 0px #121212'
              }}>
                <Icon size={24} color={color === '#FFFFFF' ? '#121212' : '#121212'} />
              </div>

              <div>
                <h3 style={{ fontWeight: 900, fontSize: 18, marginBottom: 8, letterSpacing: '-0.5px', color: '#121212' }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: '#4E4E4E', lineHeight: 1.5, fontWeight: 500 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{ padding: '0 48px 80px' }}>
        <div style={{
          background: '#D02020', 
          border: '4px solid #121212',
          padding: '64px 40px',
          textAlign: 'center',
          color: '#FFFFFF',
          boxShadow: '12px 12px 0px 0px #121212',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Constructivist decoration inside CTA */}
          <div style={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 120,
            height: 120,
            background: '#F0C020',
            border: '4px solid #121212',
            borderRadius: '50%'
          }} />

          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 16, color: '#FFFFFF' }}>
            READY TO SUMMARIZE?
          </h2>
          <p style={{ 
            color: '#FFFFFF', 
            marginBottom: 32, 
            fontSize: 16, 
            fontWeight: 500,
            maxWidth: 500,
            margin: '0 auto 32px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            No credit card. No setup. Just drop your PDF and go.
          </p>
          <Link to="/register" style={{ position: 'relative', zIndex: 5 }}>
            <button className="btn" style={{ 
              background: '#121212', 
              color: '#FFFFFF', 
              border: '4px solid #121212', 
              boxShadow: '6px 6px 0px 0px #FFFFFF',
              padding: '16px 36px',
              fontSize: 16
            }}>
              GET STARTED FREE <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer" style={{ 
        borderTop: '4px solid #121212', 
        padding: '32px 48px', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#FFFFFF'
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#121212', textTransform: 'uppercase' }}>
          © 2026 Summarize System
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#7A7A7A' }}>Form Follows Function</span>
        </div>
      </footer>
    </div>
  )
}

