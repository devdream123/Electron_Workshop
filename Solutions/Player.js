import React from 'react';

// Import images for the player
import playerActive from './images/ava_active.png';
import playerInActive from './images/ava_inactive.png';


// Connect css file
import './App.css';

// Button component
const Buttons = (props) => {
	// The rendered button depends on the state
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
        				<button onClick={() => props.send("Change")}>Over</button>
        			</div>
        case "TURNEND":
        	return  <button onClick={() => props.send("Change")}>Over</button> 
	}
}

// Player component
const Player = (props) => (
	<div className="Player">
		{props.data.active ? <img src={playerActive}/> :  <img src={playerInActive}/> }
		<div className="Score">
			<h3>Score:</h3>
			<div>{props.data.score}</div>
		</div>
		{props.data.active ? <Buttons state={props.state} send={props.send} /> : null}
	</div>
);

export default Player;