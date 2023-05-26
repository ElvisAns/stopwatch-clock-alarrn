import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Clock from './components/Clock';
import Alarm from './components/Alarm';
import StopWatch from './components/StopWatch';
import ErrorPage from './components/common/ErrorPage';

import './App.scss';

function StopwatchRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/stopwatch');
  }, [navigate]);

  return null;
}

function App() {
  // const [count, setCount] = useState(0);
  return (
    <Router>
      <div className='main__wrapper'>
        <nav className='home__main_menu'>
          <NavLink className='home__menu_link' activeClassName='active' to='/alarm'>Alarm</NavLink>
          <NavLink className='home__menu_link' activeClassName='active' to='/clock'>Clock</NavLink>
          <NavLink className='home__menu_link' activeClassName='active' to='/stopwatch'>StopWatch</NavLink>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<StopwatchRedirect />} />
            <Route path="/alarm" element={<Alarm />} />
            <Route path="/clock" element={<Clock />} />
            <Route path="/stopwatch" element={<StopWatch />} />
            <Route path='*' element={<ErrorPage/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
