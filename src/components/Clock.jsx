import { VectorMap } from '@south-paw/react-vector-maps';
import { useEffect, useReducer, useState } from "react";
import axios from 'axios';
import '../assets/styles/Clock.scss'
import wordMap from '../../map.word.json'
import dateTime from '../utils/Dates.helper';
import BookmarkedCity from './common/BookmarkedCity';

import { toast } from 'react-toastify';

const api_key = 'eUr5IheTGlL0B79xvW8idw==q9CnijCctwdQ4mjB'

function location_reducer(state, action) {
    if (action.type == "add location") {
        const locations = [...state, {
            mapid: action.payload.id,
            country: action.payload.country,
            capital: action.payload.capital,
            timezone: action.payload.timezone,
            tzOffset: action.payload.tzOffset
        }]
        localStorage.setItem('locations', JSON.stringify(locations))
        toast.info(`Success, you have added ${action.payload.country} to your bookmark`)
        return locations;
    }

    if (action.type == "remove location") {
        const locations = state.filter((v) => v.mapid != action.payload.id)
        localStorage.setItem('locations', JSON.stringify(locations))
        toast.info(`Country ${action.payload.country} removed from your list`);
        return locations
    }

    // Default case: return state as is
    return state;
}

function getInitialLocations() {
    const locations = window.localStorage.getItem('locations');
    if (locations) {
        return JSON.parse(locations)
    }
    return []
}



const Clock = () => {
    const [locations, locationDispatcher] = useReducer(location_reducer, [], getInitialLocations)
    const [selectedArea, updateSelectedArea] = useState([])
    const [userLocalTimeDate, setCurrentUserTimeDate] = useState({})

    const layerProps = {
        onMouseEnter: ({ target }) => {
            target.attributes.title = target.attributes.name.value
        },
        //onMouseLeave: ({ target }) => setHovered('None'),
        onFocus: ({ target }) => {
            target.attributes.title = target.attributes.name.value
        },
        //onBlur: ({ target }) => setFocused('None'),
        onClick: async ({ target }) => {
            const existing = locations.find(location => location.mapid == target.attributes.id.value)
            if (!existing) {
                try {
                    toast.info("Please hold on we are setting up country infos");
                    const countryInfos = await axios.get(`https://restcountries.com/v3.1/name/${target.attributes.name.value}?fullText=true`)
                    const capital = countryInfos.data[0].capital[0];
                    const city_info = await axios.get(`https://api.api-ninjas.com/v1/worldtime?city=${capital}`, {
                        headers: {
                            'X-Api-Key': api_key
                        }
                    })

                    // Get the current user's local time
                    let userTime = new Date();
                    let targetTime = new Date().toLocaleString("en-US", { timeZone: city_info.data.timezone });
                    let timeDifference = (userTime.getTime() - new Date(targetTime).getTime()) / (60 * 1000);
                    let timeDifferenceHours = Math.floor(timeDifference / 60);
                    // Format the time difference as "+Xhrs" or "-Xhrs" or "0hrs"
                    let formattedTimeDifference = (timeDifferenceHours > 0 ? "+" : "") + timeDifferenceHours + "hrs";

                    locationDispatcher({
                        type: 'add location',
                        payload: {
                            id: target.attributes.id.value,
                            country: target.attributes.name.value,
                            capital,
                            timezone: city_info.data.timezone,
                            tzOffset: formattedTimeDifference
                        }
                    })
                }
                catch (e) {
                    toast.warning("Something went wrong, please try again! wait...are you online?");
                }

            }
            else {
                locationDispatcher({
                    type: "remove location",
                    payload: {
                        id: target.attributes.id.value,
                        country: target.attributes.name.value,
                    }
                })
            }
        },
    };
    useEffect(() => {
        updateSelectedArea(locations.map(location => location.mapid))
    }, [locations])

    useEffect(() => {
        const interval = setInterval(() => {
            let userCity = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setCurrentUserTimeDate({ ...dateTime(userCity), userCity })
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])
    return (
        <div className="clock__map_container">
            <VectorMap className='clock__vector_map' {...wordMap} layerProps={layerProps} currentLayers={selectedArea} />
            <div className='clock__user_local'>
                <div className='clock_user_local_location'>{userLocalTimeDate.userCity}</div>
                <div className='clock_user_local_time'>{userLocalTimeDate.time}</div>
                <div className='clock_user_local_date'>{userLocalTimeDate.date}</div>
            </div>
            <div className='clock__user_bookmark'>
                <BookmarkedCity meta={locations} />
            </div>
        </div>
    )
}
export default Clock