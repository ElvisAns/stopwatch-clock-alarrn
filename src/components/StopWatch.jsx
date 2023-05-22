import { useEffect, useReducer } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import LapsList from './common/LapsList';
import '../assets/styles/StopWatch.css'

const addLeadingZero = (number) => {
    return `${number >= 10 ? number : "0" + number}`
}
const reducer = (currentState, action) => {
    switch (action.type) {
        case 'reset':
            window.localStorage.setItem('timer', JSON.stringify({ seconds: 0, minutes: 0, hours: 0, progress: 0 }))
            return {
                seconds: 0,
                minutes: 0,
                hours: 0,
                progress: 0
            }
        case 'tick': {
            let { seconds, minutes, hours, progress } = currentState;
            seconds++;
            if (seconds == 60) {
                seconds = 0;
                minutes++;
            }
            if (minutes == 60) {
                minutes = 0;
                hours++;
            }
            progress = Math.round((seconds * 100) / 59)
            window.localStorage.setItem('timer', JSON.stringify({ ...currentState, seconds, minutes, hours, progress }))
            return { ...currentState, seconds, minutes, hours, progress };
        }

        case 'toggleStopWatchState': {
            const { stopWatchRunning } = currentState;
            return { ...currentState, stopWatchRunning: !stopWatchRunning }
        }

        default:
            return { ...currentState }

    }
}

const lapsListReducer = (currentList, action) => {
    switch (action.type) {
        case 'remove': {
            const prevList = [...currentList.list];
            const newList = prevList.filter((value, index) => {
                return index != action.payload.id
            })

            window.localStorage.setItem('savedLaps', JSON.stringify({ ...currentList, list: newList }))
            return { ...currentList, list: newList }

        }

        case 'add': {
            const prevList = [...currentList.list];
            prevList.push({ name: action.payload.name, value: action.payload.value })
            window.localStorage.setItem('savedLaps', JSON.stringify({ ...currentList, list: prevList }))
            return { ...currentList, list: prevList }
        }
    }
}

const Dots = () => {
    const dots = Array(8).fill(0)
    return (
        <>
            {dots.map((dot, index) => (
                <div key={index} className="progress-bar__dot"></div>
            ))}
        </>
    );
}

function getInitialState() {
    let currentStorage = window.localStorage.getItem('timer');
    if (currentStorage) {
        return JSON.parse(currentStorage)
    }
    else return {
        seconds: 0,
        minutes: 0,
        hours: 0,
        progress: 0,
        stopWatchRunning: false
    }
}
function getInitialLaps() {
    let savedLapsList = window.localStorage.getItem('savedLaps');
    if (savedLapsList) {
        return JSON.parse(savedLapsList)
    }
    else return {
        list: [{
            name: 'Elvis',
            value: 'Ansima'
        }]
    };
}
const StopWatch = () => {
    const [timer, updateTimer] = useReducer(reducer, {
        seconds: 0,
        minutes: 0,
        hours: 0,
        progress: 0,
        stopWatchRunning: false
    }, getInitialState)

    const [laps, updateLapsList] = useReducer(lapsListReducer, { list: [] }, getInitialLaps)

    const timerInitialized = () => {
        return (timer.seconds > 0 || timer.minutes > 0 || timer.hours > 0)
    }

    const saveLaps = () => {
        let lapsName = prompt("Please give a name to this laps",`Lap${laps.list.length+1}`)

        if(lapsName){
        updateLapsList({
            type: 'add',
            payload: {
                name: lapsName,
                value: addLeadingZero(timer.hours) + `:` + addLeadingZero(timer.minutes) + `:` + addLeadingZero(timer.seconds)
            }
        })
        }
    }

    useEffect(() => {
        let intervalId;
        if (timer.stopWatchRunning) {
            intervalId = setInterval(() => {
                updateTimer({ type: 'tick' })
            }, 1000);
        }
        return () => {
            clearInterval(intervalId);
        }
    }, [timer.stopWatchRunning])


    return (
        <div className='stopwatch__container'>
            <div className='stopwatch__progress-bar'>
                <CircularProgressbarWithChildren
                    strokeWidth='5'
                    styles={buildStyles({
                        rotation: 0,
                        strokeLinecap: 'butt',
                        textSize: '12px',
                        pathTransitionDuration: 0.5,
                        pathColor: `var(--main-light)`,
                        textColor: 'var(--main-light)',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                    })} value={timer.progress} text={addLeadingZero(timer.hours) + `:` + addLeadingZero(timer.minutes) + `:` + addLeadingZero(timer.seconds)}>
                    <Dots />
                    <div className='stopwatch__decorative wide'></div>
                    <div className='stopwatch__decorative small'></div>
                    <button onClick={saveLaps} className='stopwatch__button_save'>Save laps</button>
                </CircularProgressbarWithChildren >

            </div>
            <div className='stopwatch_laps__container'>
                <LapsList list={laps.list} removeFromList={updateLapsList}/>
            </div>


            <div className='stopWatch__control_buttons'>
                <button className='stopwatch__button_start' onClick={() => updateTimer({ type: 'toggleStopWatchState' })}>{timer.stopWatchRunning ? 'Pause' : timerInitialized() ? 'Continue' : 'Start'}</button>
                <button className='stopwatch__button_reset' onClick={() => updateTimer({ type: 'reset' })}>Reset</button>
            </div>
        </div>
    )
}
export default StopWatch