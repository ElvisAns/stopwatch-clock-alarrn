import { PropTypes } from "prop-types";

export default function LapsList({ list, removeFromList }) {
    return (
        <>
            {
                list.map((content, index) => (<div className="stopwatch__laps" key={index}><div>{content.name}</div><div style={{ fontWeight: 'bolder' }}>{content.value}<span onClick={()=>removeFromList({ type: 'remove', payload: { id: index } })} title="remove">&#10060;</span></div></div>))
            }
        </>
    )
}

LapsList.propTypes = {
    list: PropTypes.array.isRequired,
    removeFromList: PropTypes.func.isRequired
}