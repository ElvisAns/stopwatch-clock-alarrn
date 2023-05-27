import propTypes from 'prop-types'
import dateTime from '../../utils/Dates.helper'
export default function BookmarkedCity({ meta }) {
    return (
        <>
            {meta.map((info, index) => (
                <div key={index} className='single_bookmark'>
                    <div style={{textAlign:"left"}}>
                        <div className='capital'>{info.capital}</div>
                        <div className='country'>{info.country}</div>
                        <div className='tz'>{info.tzOffset}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                        <div className='time'>{dateTime(info.timezone,"time")}</div>
                        <div className='date'>{dateTime(info.timezone,"date")}</div>
                    </div>
                </div>)
            )}
        </>
    )
}

BookmarkedCity.propTypes = {
    meta: propTypes.array.isRequired
}