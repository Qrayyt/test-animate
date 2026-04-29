import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const root = document.getElementById('root');

function App(){
  const path = window.location.pathname.includes('/ai') ? 'ai' : 'auth';
  return root ? (
    React.createElement('main',{className:'page'},
      React.createElement('div',{className:'top-label'},
        React.createElement('span',null,'GALENITE'),
        React.createElement('span',null,path.toUpperCase())
      ),
      React.createElement('section',{className:path==='ai' ? 'ai-layout' : 'auth-shell'},
        React.createElement('div',{className:'auth-card'},
          React.createElement('h1',null,path==='ai' ? 'AI Interface' : 'Auth Gate'),
          React.createElement('p',null,path==='ai' ? 'GitHub Pages route fixed. Demo page active.' : 'Пароль для входа: galenite')
        )
      )
    )
  ) : null;
}

createRoot(root).render(React.createElement(App));
