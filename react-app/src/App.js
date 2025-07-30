import './App.css';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Main from './pages/Main';
import Setup from './pages/Setup';
import Game from './pages/Game';
import Learn from './pages/Learn';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/game" element={<Game />} />
          <Route path="/learn" element={<Learn />} />
        </Routes>
      </Router>
  );
}

export default App;