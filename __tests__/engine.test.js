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
	var gso = engine.msgReceived("Deal");
	expect(gso.state).toEqual("DEALT");
	expect(gso.players[0]["dealt"].length).toEqual(3);
	expect(gso.players[0]["thrown"].length).toEqual(0);
	expect(gso.players[0]["dealt"][0]).not.toEqual(gso.players[0]["dealt"][1]);
	expect(gso.players[0]["dealt"][0]).not.toEqual(gso.players[0]["dealt"][2]);
	expect(gso.players[0]["dealt"][1]).not.toEqual(gso.players[0]["dealt"][2]);
});

test("Give dice - player has 2 paws in hand", () =>{
	engine.setGSO(
		{
			"players": [
				{
					"dealt":["dice8", "dice4"],
					"thrown": [],
					"table" : [],
				}
			]
		}
	)
	var gso = engine.msgReceived("Deal");
	expect(gso.state).toEqual("DEALT");
	expect(gso.players[0]["dealt"].length).toEqual(3);
	expect(gso.players[0]["dealt"][0]).toEqual("dice8");
	expect(gso.players[0]["dealt"][1]).toEqual("dice4");
	expect(gso.players[0]["dealt"][2]).not.toEqual("dice8");
	expect(gso.players[0]["dealt"][2]).not.toEqual("dice4");

});


test("Throw the dices player got, set state to  THROWN", () => {
	engine.setGSO(
		{
			"players": [
				{
					"dealt":[ "dice8", "dice4", "dice10"],
					"thrown": []
				}
			]
		}
	)
	var gso1 = engine.msgReceived("Throw");
	var diceNames = gso1.players[0].thrown.map(x => x.name);

	expect(gso1.players[0].thrown.length).toEqual(3);
	expect(diceNames).toEqual([ "dice8", "dice4", "dice10"]);
	expect(gso1.state).toEqual("THROWN");

});

test("Player threw 3 cabbages - his turn is over, set state to TURNEND", () => {
	engine.setGSO(
		{
			"players": [
				{
					"dealt":[],
					"thrown": [ 
						{"name":"dice8", "side": "cabbage"},
						{"name":"dice4", "side": "cabbage"},
						{"name":"dice10", "side": "cabbage"}
					],
					"table":[]
				}
			]
		}
	)
	var gso1 = engine.msgReceived("Count");
	expect(gso1.state).toEqual("TURNEND");
	expect(gso1.players[0].table).toEqual([	
						{"name":"dice8", "side": "cabbage"},
						{"name":"dice4", "side": "cabbage"},
						{"name":"dice10", "side": "cabbage"}
	]);
	expect(gso1.players[0].thrown).toEqual([]);
	expect(gso1.players[0].dealt).toEqual([]);
});

test("Player threw 3 paws, set state to AGAIN", () => {
	engine.setGSO(
		{
			"players": [
				{
					"dealt":[],
					"thrown": [ 
						{"name":"dice8", "side": "paws"},
						{"name":"dice4", "side": "paws"},
						{"name":"dice10", "side": "paws"},
					],
					"table" : []
				}
			]
		}
	)
	var gso1 = engine.msgReceived("Count");
	expect(gso1.state).toEqual("AGAIN");
	expect(gso1.players[0].table).toEqual([]);
	expect(gso1.players[0].thrown).toEqual([]);
	expect(gso1.players[0].dealt).toEqual([ "dice8", "dice4", "dice10"]);
});

test("Player has 1 corgi, 1 paw and 1 cabbage, it's second cabbage, state is AGAIN", () =>{
	engine.setGSO(
		{
			"players": [
				{
					"dealt":[],
					"thrown": [ 
						{"name":"dice8", "side": "corgi"},
						{"name":"dice4", "side": "paws"},
						{"name":"dice10", "side": "cabbage"},
					],
					"table" : [
						{"name":"dice1", "side": "cabbage"}
					],
				}
			]
		}
	)
	var gso1 = engine.msgReceived("Count");
	expect(gso1.state).toEqual("AGAIN");
	expect(gso1.players[0].dealt).toEqual(["dice4"]);
	expect(gso1.players[0].table).toEqual([
							{"name":"dice1", "side": "cabbage"},
							{"name":"dice8", "side": "corgi"},
							{"name":"dice10", "side": "cabbage"}
	]);
	expect(gso1.players[0].thrown).toEqual([]);
})

test("Player has 2 corgis and 1 cabbage, it's third cabbage, state is TURNEND", () =>{
	engine.setGSO(
		{
			"players": [
				{
					"dealt":[],
					"thrown": [ 
						{"name":"dice8", "side": "corgi"},
						{"name":"dice4", "side": "corgi"},
						{"name":"dice10", "side": "cabbage"}
					],
					"table" : [
						{"name":"dice1", "side": "cabbage"},
						{"name":"dice2", "side": "cabbage"}
					],
				}
			]
		}
	)
	var gso1 = engine.msgReceived("Count");
	expect(gso1.state).toEqual("TURNEND");
});

test("Player wants to play again, state is TURNSTART", () =>{
	engine.setGSO({ "state": "AGAIN" });
	var gso1 = engine.msgReceived("Again");
	expect(gso1.state).toEqual("TURNSTART");
});

test("The turn is over, count points", () =>{
	engine.setGSO(
		{
			"players": [
				{
					"active": true,
					"dealt":[],
					"thrown": [],
					"table" : [
						{"name":"dice1", "side": "cabbage"},
						{"name":"dice2", "side": "cabbage"},
						{"name":"dice8", "side": "corgi"},
						{"name":"dice4", "side": "corgi"},
						{"name":"dice11", "side": "corgi"}
					],
					"score": 0
				}, 
				{
					"active": false,
				}
			]
		}
	)
	var gso1 = engine.msgReceived("Change");
	expect(gso1.players[0].score).toEqual(1);
	expect(gso1.players[0].active).toEqual(false);
	expect(gso1.players[1].active).toEqual(true);
	expect(gso1.state).toEqual("TURNSTART");
});

