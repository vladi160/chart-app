import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Chart from './Chart';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {
  return (
    <div>
      <Chart />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
