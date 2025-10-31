import React, {useEffect, useState} from 'react'
import { BACKEND_URL } from './config'

function App(){
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [linkLoading, setLinkLoading] = useState(false)

  useEffect(()=>{ fetchNews() },[])

  async function fetchNews(){
    setLoading(true)
    try{
      const res = await fetch(BACKEND_URL + '/news')
      const j = await res.json()
      setNews(j.samples || [])
    }catch(err){
      console.error(err)
    }finally{ setLoading(false) }
  }

  function handleAsk(){
    if(!query.trim()) return setAnswer('Please type a question or topic.')
    const q = query.toLowerCase()
    const found = news.find(n => (n.title + ' ' + n.summary).toLowerCase().includes(q))
    if(found) setAnswer(found.title + ' — ' + found.summary)
    else setAnswer('Sorry, I could not find a direct match. Try something else or check the Headlines.')
  }

  async function handleGenerateLink(target){
    setLinkLoading(true); setGeneratedLink('')
    try{
      const res = await fetch(BACKEND_URL + '/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target })
      })
      const j = await res.json()
      if(j.trackLink) setGeneratedLink(j.trackLink)
      else setGeneratedLink('Failed to create link')
    }catch(err){ setGeneratedLink('Backend error') }finally{ setLinkLoading(false) }
  }

  const top3 = news.slice(0,3)

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo">QN</div>
          <div>
            <div className="title">Quick NewsGPT</div>
            <div className="subtitle">Smart News, Simplified</div>
          </div>
        </div>
        <div className="small">Connected to: <strong>{BACKEND_URL}</strong></div>
      </header>

      <div className="grid">
        <main>
          <div className="card">
            <h3>Headlines</h3>
            <div className="small" style={{marginTop:6}}>Latest AI-curated headlines from backend</div>
            <div style={{marginTop:12}}>
              {loading ? <div className="small">Loading...</div> :
                news.length===0 ? <div className="small">No headlines yet.</div> :
                news.map(n => (
                  <div key={n.id} className="news-item">
                    <div className="news-title">{n.title}</div>
                    <div className="news-summary">{n.summary}</div>
                    <div className="actions">
                      <button className="btn-secondary" onClick={()=>handleGenerateLink(BACKEND_URL + '/news')}>Read Full Story</button>
                      <button className="btn" onClick={()=>{ navigator.clipboard.writeText(n.title + ' - ' + n.summary); }}>Copy Summary</button>
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="adbox">
              Sponsored • Ad Space — Place your ad code here (AdSense / native)
            </div>
          </div>

          <div className="card" style={{marginTop:12}}>
            <h3>Ask Quick NewsGPT</h3>
            <div className="small">Type a topic or question and press Ask — (demo: matches headlines)</div>
            <div className="ask-box" style={{marginTop:8}}>
              <input className="input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. AI policy, monsoon updates" />
              <button className="btn" onClick={handleAsk}>Ask</button>
            </div>
            <div style={{marginTop:12}}>
              <div className="small">Answer:</div>
              <div style={{marginTop:8, padding:12, background:'#fbfdff', borderRadius:8}}>{answer || 'Ask something to get started.'}</div>
            </div>
          </div>

        </main>

        <aside>
          <div className="card">
            <h4>Top 3 Headlines</h4>
            <div className="top3">
              {top3.length===0 ? <div className="small">No headlines</div> :
                top3.map(t => <div key={t.id} className="top3-item"><strong>{t.title}</strong><div className="small">{t.summary}</div></div>)
              }
            </div>
            <div style={{marginTop:12}} className="small">
              <div>Generate a trackable link for any article</div>
              <div style={{marginTop:8}}>
                <input id="genInput" className="input" placeholder="Paste article URL and press Generate" />
                <div style={{marginTop:8}}>
                  <button className="btn" onClick={()=>{
                    const v = document.getElementById('genInput').value;
                    if(v) handleGenerateLink(v);
                  }}>{linkLoading ? 'Generating...' : 'Generate Link'}
                </div>
                {generatedLink && (
  <div style={{ margin: '10px 0' }}>
    {generatedLink}
  </div>
)}
wordBreak:'break-all'}}><div className="small">Tracking Link:</div><div style={{marginTop:6, padding:8, background:'#f8fafc', borderRadius:8'}}>{generatedLink}</div></div>}
              </div>
            </div>
            <div style={{marginTop:12}} className="small">
              <div>View stats: <a href={BACKEND_URL + '/stats'} target="_blank" rel="noreferrer">/stats</a></div>
              <div style={{marginTop:8}}>Run summary: <a href={BACKEND_URL + '/send-summary'} target="_blank" rel="noreferrer">/send-summary</a></div>
            </div>
          </div>

          <div className="card" style={{marginTop:12}}>
            <h4>About</h4>
            <div className="small">Quick NewsGPT demo — frontend connected to your backend. Ad-ready layout and simple Ask box.</div>
          </div>

        </aside>
      </div>

      <div className="footer">© 2025 Quick NewsGPT — Built by Kailash Gautam</div>
    </div>
  )
}

export default App
