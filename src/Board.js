import React from 'react';
import dice from './data/dice.json'
import corgi from './images/corgi.png';
import cabbage from './images/cabbage.png';
import paws from './images/paws.png';
import corgiIcon from './images/corgiIcon.png';
import cabbageIcon from './images/cabbageIcon.png';

const Dice = (props) => (
	<div style={{backgroundColor: props.color, width:"200px", height: "100px", margin: "1em"}}>
		{props.side=="corgi" ? <img src={corgi}/> : null}
		{props.side=="cabbage" ? <img src={cabbage}/> : null}
		{props.side=="paws" ? <img src={paws}/> : null}
	</div>
)

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

function renderCurrentResult(hand){
	return (
		<div>
			<h2>Turn Results</h2>
			{
				hand.map(x => <div key={x.name}> <img src={x.side=="corgi" ? corgiIcon : cabbageIcon}/> </div>)
			}
		</div>
	)
}

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


const Board = (props) => (
	<div className="Board">
		{props.state != "TURNSTART" ? <DiceElement state={props.state} data={props.data}/> :  null}
	</div>
);

export default Board;