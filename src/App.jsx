import { useState } from 'react'

import Clock from './components/Clock'
import Alarm from './components/Alarm'
import StopWatch from './components/StopWatch'

import './App.css'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <div className='main__wrapper'>
      <nav className='home__main_menu'>
        <a className='home__menu_link' href='#'>Alarm</a>
        <a className='home__menu_link' href='#'>Clock</a>
        <a className='home__menu_link active' href='#'>StopWatch</a>
      </nav>
      <main>
        <Alarm />
        <Clock />
        <StopWatch />
      </main>
    </div>
  )
}

export default App
