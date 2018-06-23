import React from 'react';
import playerActive from './images/ava_active.png';
import playerInActive from './images/ava_inactive.png';

const Buttons = (props) => {
	switch(props.state){
		case "TURNSTART":
			return  <button onClick={() => props.send("Deal")}>Deal</button> 
		case "DEALT":
            return  <button onClick={() => props.send("Throw")}>Throw</button> 
        case "THROWN":
        	return  <button onClick={() => props.send("Count")}>Count</button> 
        case "AGAIN":
        	return  <div>
        				<button onClick={() => props.send("Again")}>Again</button> 
        				<button onClick={() => props.send("Change")}>Turn Over</button>
        			</div>
        case "TURNEND":
        	return  <button onClick={() => props.send("Change")}>Turn Over</button> 
	}
}

const Player = (props) => (
	<div className="Player">
		{props.data.active ? <img src={playerActive}/> :  <img src={playerInActive}/> }
		{props.data.active ? <Buttons state={props.state} send={props.send} /> : null}
				<textarea cols={20} rows={20} value={JSON.stringify(props.data)} />
	</div>
);

export default Player;