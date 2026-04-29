import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bot, Lock, LogOut, Sparkles, Send, Shield, Command, Cpu } from 'lucide-react';
import './style.css';

const PASSWORD = 'galenite';

function routeTo(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  React.useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

function Noise() {
  return <div className="noise" aria-hidden="true" />;
}

function FloatingGrid() {
  return (
    <div className="grid-wrap" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="grid-dot"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: [0.15, 0.55, 0.15], y: [18, -16, 18] }}
          transition={{ duration: 5 + (i % 5), repeat: Infinity, delay: i * 0.15 }}
          style={{ left: `${(i * 17) % 100}%`, top: `${(i * 29) % 100}%` }}
        />
      ))}
    </div>
  );
}

function AuthPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (password === PASSWORD) {
        localStorage.setItem('glnt-auth', 'true');
        routeTo('/ai');
      } else {
        setError('Пароль не тот. Тут тестовый ключ: galenite');
        setLoading(false);
      }
    }, 700);
  }

  return (
    <main className="page auth-page">
      <Noise />
      <FloatingGrid />
      <motion.div className="halo halo-left" animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 7, repeat: Infinity }} />
      <motion.div className="top-label" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <span>GALENITE</span>
        <span>AUTH GATE</span>
      </motion.div>

      <section className="auth-shell">
        <motion.div className="auth-card" initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <motion.div className="avatar" animate={{ y: [0, -8, 0], rotate: [0, -2, 2, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <Sparkles size={34} />
          </motion.div>
          <div className="auth-copy">
            <p className="eyebrow">private access</p>
            <h1>Вход в тестовый интерфейс</h1>
            <p>Минимальная авторизация в стиле Galenite: светлая база, черные акценты, плавные микро-анимации.</p>
          </div>

          <form onSubmit={submit} className="auth-form">
            <label>
              <span>Пароль</span>
              <div className="input-wrap">
                <Lock size={18} />
                <input autoFocus type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите пароль" />
                <motion.button whileTap={{ scale: 0.94 }} className="circle-btn" type="submit" aria-label="Войти">
                  <ArrowRight size={20} />
                </motion.button>
              </div>
            </label>
            <AnimatePresence>{error && <motion.p className="error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.p>}</AnimatePresence>
            <button className="main-btn" type="submit" disabled={loading}>{loading ? 'Проверяю доступ...' : 'Войти'}</button>
          </form>
        </motion.div>

        <motion.div className="side-stack" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
          {[['01', 'white core'], ['02', 'motion first'], ['03', 'ai preview']].map(([n, t]) => (
            <motion.div className="side-chip" key={n} whileHover={{ x: 8 }}>
              <b>{n}</b><span>{t}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}

const botReplies = [
  'Галенит на связи. Я бы начал с чистого интерфейса, а потом уже подключал реальную модель.',
  'Принял запрос. Сейчас это демо, но визуально уже можно тестировать поведение чата.',
  'Логика простая: запрос → мягкая анимация → ответ. Дальше сюда легко повесить API.'
];

function AiPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Привет. Это тестовый AI-интерфейс Galenite. Напиши что-нибудь.' }
  ]);
  const [typing, setTyping] = useState(false);
  const replyIndex = useRef(0);

  function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setTyping(true);
    setTimeout(() => {
      const reply = botReplies[replyIndex.current % botReplies.length];
      replyIndex.current += 1;
      setMessages((m) => [...m, { role: 'bot', text: reply }]);
      setTyping(false);
    }, 650);
  }

  function logout() {
    localStorage.removeItem('glnt-auth');
    routeTo('/auth');
  }

  return (
    <main className="page ai-page">
      <Noise />
      <FloatingGrid />
      <header className="ai-header">
        <div><b>GALENITE AI</b><span>demo interface</span></div>
        <button onClick={logout}><LogOut size={17} /> выйти</button>
      </header>

      <section className="ai-layout">
        <motion.aside className="ai-panel" initial={{ opacity: 0, x: -26 }} animate={{ opacity: 1, x: 0 }}>
          <div className="panel-logo"><Bot size={30} /></div>
          <h2>AI Office Core</h2>
          <p>Пока без реального API. Здесь проверяется ощущение продукта: воздух, ритм, анимации, чат.</p>
          <div className="metric"><Shield size={18} /><span>Auth: local test</span></div>
          <div className="metric"><Command size={18} /><span>Route: /ai</span></div>
          <div className="metric"><Cpu size={18} /><span>Model: mock</span></div>
        </motion.aside>

        <motion.section className="chat-card" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <div className="chat-top"><span></span><b>Galenite Chat</b><em>online</em></div>
          <div className="messages">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div key={i} className={`msg ${m.role}`} initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}>
                  {m.text}
                </motion.div>
              ))}
              {typing && <motion.div className="msg bot typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><i></i><i></i><i></i></motion.div>}
            </AnimatePresence>
          </div>
          <form onSubmit={send} className="composer">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Напиши запрос..." />
            <motion.button whileTap={{ scale: 0.94 }} type="submit"><Send size={18} /></motion.button>
          </form>
        </motion.section>
      </section>
    </main>
  );
}

function App() {
  const path = useRoute();
  const authed = localStorage.getItem('glnt-auth') === 'true';
  React.useEffect(() => {
    if (path === '/') routeTo('/auth');
    if (path === '/ai' && !authed) routeTo('/auth');
  }, [path, authed]);
  return path === '/ai' && authed ? <AiPage /> : <AuthPage />;
}

createRoot(document.getElementById('root')).render(<App />);
