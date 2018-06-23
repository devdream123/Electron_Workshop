const engine = require("../engine");

test("Init the game: active player is set, state is TURNSTART", ()=> {
	var gso = {
		"players": [
			{"active": true},
			{"active": false}
		],
		"state": "TURNSTART"
	}
	var gso1 = engine.msgReceived("Init");
	expect(gso1).toMatchObject(gso);
});

test("Give dice - player didn't throw yet, state is DEALT", () => {
	engine.setGSO({
		"players": [
			{ "active": true },
			{ "active": false }
		],
		"board": {
			"dealt":[],
			"thrown": [],
			"hand": []
		}
	});
	var gso = engine.msgReceived("Deal");
	expect(gso.state).toEqual("DEALT");
	expect(gso.board["dealt"].length).toEqual(3);
	expect(gso.board["thrown"].length).toEqual(0);
	expect(gso.board["dealt"][0]).not.toEqual(gso.board["dealt"][1]);
	expect(gso.board["dealt"][0]).not.toEqual(gso.board["dealt"][2]);
	expect(gso.board["dealt"][1]).not.toEqual(gso.board["dealt"][2]);
});

test("Give dice - player has 2 paws in hand", () =>{
	engine.setGSO(
		{
			"players": [
				{ "active": true }
			],
			"board": {
				"dealt":["dice8", "dice4"],
				"thrown": [],
				"hand" : [],
			}
		}
	)
	var gso = engine.msgReceived("Deal");
	expect(gso.state).toEqual("DEALT");
	expect(gso.board["dealt"].length).toEqual(3);
	expect(gso.board["dealt"][0]).toEqual("dice8");
	expect(gso.board["dealt"][1]).toEqual("dice4");
	expect(gso.board["dealt"][2]).not.toEqual("dice8");
	expect(gso.board["dealt"][2]).not.toEqual("dice4");
});

test("Give dice to second player - player didn't throw yet, state is DEALT", () => {
	engine.setGSO({
		"players": [
			{ "active": false },
			{ "active": true }
		],
		"board": {
			"dealt":[],
			"thrown": [],
			"hand": []
		}
	});
	var gso = engine.msgReceived("Deal");
	expect(gso.state).toEqual("DEALT");
	expect(gso.board["dealt"].length).toEqual(3);
	expect(gso.board["thrown"].length).toEqual(0);
	expect(gso.board["dealt"][0]).not.toEqual(gso.board["dealt"][1]);
	expect(gso.board["dealt"][0]).not.toEqual(gso.board["dealt"][2]);
	expect(gso.board["dealt"][1]).not.toEqual(gso.board["dealt"][2]);
});


test("Throw the dices player got, set state to THROWN", () => {
	engine.setGSO(
		{
			"players": [
				{ "active": true }
			],
			"board": {
				"dealt":[ "dice8", "dice4", "dice10"],
				"thrown": []
			}
		}
	)
	var gso = engine.msgReceived("Throw");
	var diceNames = gso.board.thrown.map(x => x.name);

	expect(gso.board.thrown.length).toEqual(3);
	expect(diceNames).toEqual([ "dice8", "dice4", "dice10"]);
	expect(gso.state).toEqual("THROWN");
});

test("Player threw 3 cabbages - his turn is over, set state to TURNEND", () => {
	engine.setGSO(
		{
			"players": [
				{ "active": true }
			],
			"board": {
				"dealt":[],
				"thrown": [ 
					{"name":"dice8", "side": "cabbage"},
					{"name":"dice4", "side": "cabbage"},
					{"name":"dice10", "side": "cabbage"}
				],
				"hand":[]
			}
		}
	)
	var gso = engine.msgReceived("Count");
	expect(gso.state).toEqual("TURNEND");
	expect(gso.board.hand).toEqual([	
						{"name":"dice8", "side": "cabbage"},
						{"name":"dice4", "side": "cabbage"},
						{"name":"dice10", "side": "cabbage"}
	]);
	expect(gso.board.thrown).toEqual([]);
	expect(gso.board.dealt).toEqual([]);
});

test("Player threw 3 paws, set state to AGAIN", () => {
	engine.setGSO(
		{
			"players": [
				{ "active": true }
			],
			"board": {
				"dealt":[],
				"thrown": [ 
					{"name":"dice8", "side": "paws"},
					{"name":"dice4", "side": "paws"},
					{"name":"dice10", "side": "paws"},
				],
				"hand" : []
			}
		}
	)
	var gso = engine.msgReceived("Count");
	expect(gso.state).toEqual("AGAIN");
	expect(gso.board.hand).toEqual([]);
	expect(gso.board.thrown).toEqual([]);
	expect(gso.board.dealt).toEqual([ "dice8", "dice4", "dice10"]);
});

test("Player has 1 corgi, 1 paw and 1 cabbage, it's second cabbage, state is AGAIN", () =>{
	engine.setGSO(
		{
			"players": [
				{ "active": true }
			],
			"board": {
				"dealt":[],
				"thrown": [ 
					{"name":"dice8", "side": "corgi"},
					{"name":"dice4", "side": "paws"},
					{"name":"dice10", "side": "cabbage"},
				],
				"hand" : [
					{"name":"dice1", "side": "cabbage"}
				],
			}
		}
	)
	var gso = engine.msgReceived("Count");
	expect(gso.state).toEqual("AGAIN");
	expect(gso.board.dealt).toEqual(["dice4"]);
	expect(gso.board.hand).toEqual([
							{"name":"dice1", "side": "cabbage"},
							{"name":"dice8", "side": "corgi"},
							{"name":"dice10", "side": "cabbage"}
	]);
	expect(gso.board.thrown).toEqual([]);
})

test("Player has 2 corgis and 1 cabbage, it's third cabbage, state is TURNEND", () =>{
	engine.setGSO(
		{
			"players": [
				{ "active": true }
			],
			"board": {
				"dealt":[],
				"thrown": [ 
					{"name":"dice8", "side": "corgi"},
					{"name":"dice4", "side": "corgi"},
					{"name":"dice10", "side": "cabbage"}
				],
				"hand" : [
					{"name":"dice1", "side": "cabbage"},
					{"name":"dice2", "side": "cabbage"}
				],
			}
		}
	)
	var gso = engine.msgReceived("Count");
	expect(gso.state).toEqual("TURNEND");
});

test("Player wants to play again, state is TURNSTART", () =>{
	engine.setGSO({ "state": "AGAIN" });
	var gso = engine.msgReceived("Again");
	expect(gso.state).toEqual("TURNSTART");
});

test("The turn is over, count points, player 1 was active", () =>{
	engine.setGSO(
		{
			"players": [
				{ "active": true, "score": 0 },
				{ "active": false }
			],
			"board": {
				"dealt":[],
				"thrown": [],
				"hand" : [
					{"name":"dice1", "side": "cabbage"},
					{"name":"dice2", "side": "cabbage"},
					{"name":"dice8", "side": "corgi"},
					{"name":"dice4", "side": "corgi"},
					{"name":"dice11", "side": "corgi"}
				]
			}
		}
	)
	var gso = engine.msgReceived("Change");
	expect(gso.players[0].score).toEqual(1);
	expect(gso.players[0].active).toEqual(false);
	expect(gso.players[1].active).toEqual(true);
	expect(gso.state).toEqual("TURNSTART");
	expect(gso.board).toMatchObject({ "dealt": [], "thrown": [], "hand": [] });
});

test("The turn is over, count points, player 2 was active", () =>{
	engine.setGSO(
		{
			"players": [
				{ "active": false },
				{ "active": true, "score": 4 }
			],
			"board": {
				"dealt": ["dice2", "dice3"],
				"thrown": [],
				"hand" : [
					{"name":"dice1", "side": "cabbage"},
				]
			}
		}
	)
	var gso = engine.msgReceived("Change");
	expect(gso.players[1].score).toEqual(4);
	expect(gso.players[1].active).toEqual(false);
	expect(gso.players[0].active).toEqual(true);
	expect(gso.state).toEqual("TURNSTART");
	expect(gso.board).toMatchObject({ "dealt": [], "thrown": [], "hand": [] });
});
