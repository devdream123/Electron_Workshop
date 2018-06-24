import React from 'react';

// Import images for dices and score
import dice from './data/dice.json'
import corgi from './images/corgi.png';
import cabbage from './images/cabbage.png';
import paws from './images/paws.png';
import corgiIcon from './images/corgiIcon.png';
import cabbageIcon from './images/cabbageIcon.png';


// Connect css file
import './App.css';


// Separate function to render our dice before they have sides. Uses Dice component.
function renderEmptyDice(dealt){
	return (
		<div>
			<h2>Dealing dice</h2>
			<Dice color={dice[dealt[0]].color} side={null}/>
			<Dice color={dice[dealt[1]].color} side={null}/>
			<Dice color={dice[dealt[2]].color} side={null}/>
		</div>
	)
}

// Separate function to render our dice with sides. Uses Dice component.
function renderFilledDice(thrown){
	return (
		<div>
			<h2>Throwing dice</h2>
			<Dice color={dice[thrown[0].name].color} side={thrown[0].side}/>
			<Dice color={dice[thrown[1].name].color} side={thrown[1].side}/>
			<Dice color={dice[thrown[2].name].color} side={thrown[2].side}/>
		</div>
	)
}


// Separate function to render the results for the player within a turn.
function renderCurrentResult(hand){
	return (
		<div>
			<h2>Turn Results</h2>
			{
				hand.map(x => <div key={x.name} className="DiceIcon"> <img src={x.side=="corgi" ? corgiIcon : cabbageIcon}/> </div>)
			}
		</div>
	)
}

// Component for Dice
const Dice = (props) => (
	<div className="Dice" style={{backgroundColor: props.color}}>
		{props.side=="corgi" ? <img src={corgi}/> : null}
		{props.side=="cabbage" ? <img src={cabbage}/> : null}
		{props.side=="paws" ? <img src={paws}/> : null}
	</div>
)

// Component that analyses the state and calls relevat function to display the elements.
const DiceElement = (props) => {
	switch(props.state){
		case "DEALT":
			return renderEmptyDice(props.data.dealt);
        case "THROWN":
        	return renderFilledDice(props.data.thrown);
        case "AGAIN":
        	return renderCurrentResult(props.data.hand);
        case "TURNEND":
        	return renderCurrentResult(props.data.hand);
	}
}

// Main component of the board.
const Board = (props) => (
	<div className="Board">
		{props.state != "TURNSTART" ? <DiceElement state={props.state} data={props.data}/> :  <p>Get corgis, avoid cabbages!</p>}
	</div>
);

export default Board;