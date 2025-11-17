import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// GitHub Pages basename configuration
const isGitHubPages = window.location.hostname.includes('github.io');
const basename = isGitHubPages ? '/project-kemandirian' : '';

// Set basename for React Router
window.__basename = basename;

createRoot(document.getElementById('root')!).render(<App />);
