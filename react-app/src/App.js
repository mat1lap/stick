import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Setup from './pages/Setup';
import Game from './pages/Game';
import Learn from './pages/Learn';
import Statistics from './pages/Statistics';
import Replay from './pages/Replay';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/replay" element={<Replay />} />
      </Routes>
    </Router>
  );
}