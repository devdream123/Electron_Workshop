// Require the gso template and the dices to throw
const dice =  require("./data/dice.json");
var gso =  require("./data/gso.json");

/************* HELPERS ***************/
// Helper to get random number up to given
function getRandomUpTo(n){
    return Math.round((Math.random() * n));
}

// Helper to make sure we get random dices
function getRandomDice(player){
    var newDice;
    do {
        var diceIndex = getRandomUpTo(12);
        newDice = dice["dice"+diceIndex]["name"];
    } while(player.dealt.indexOf(newDice) != -1 || 
            player.table.map(x => x.name).indexOf(newDice.name) != -1);

    return newDice;
}


// Helper to throw 1 of 6 sides of this dice
function throwRandomSides(player){
    player.dealt.forEach(function(diceName){
        var playersDice = dice[diceName];
        var result = {name: playersDice["name"], side : playersDice.sides[getRandomUpTo(5)]};
        player.thrown.push(result);
    });
    player.dealt = [];
    return player;
}


// Check and count the results
function parseThrowResults(player){
    player.thrown.forEach(function(playersDice){
        if(playersDice.side=="paws"){
           player.dealt.push(playersDice.name);
        } else {
            player.table.push(playersDice);
        }
    });

    player.thrown = [];
    return player;
}

// Check the number of points for cabbages and corgis
function scoreTable(player){
    var score = {
        "corgi" : 0,
        "cabbage" : 0
    }

    player.table.forEach(function(playerDice){
        score[playerDice.side] += 1;
    });

    return score;
}

function activePlayer(){
    return gso.players[0].active ? gso.players[0] : gso.players[1];
}

/************* GAME STATES ***************/
// The initial state of the game
function initGame(){
    return gso;
}

// Give dices to player based on his previous actions
function getDices(){
    var diceNeeded = 3-activePlayer()["dealt"].length;
    for(var i=0; i<diceNeeded; i++) {
        activePlayer()["dealt"].push(getRandomDice(activePlayer()));
    }

    gso.state = "DEALT";
    return gso;
}

// Assign sides to dices
function throwDices(){
    throwRandomSides(activePlayer());
    gso.state = "THROWN";
    return gso;
}


// 
function countScore(){
    var playerWithResults = parseThrowResults(activePlayer());
    if(scoreTable(playerWithResults).cabbage >=3){
        gso.state = "TURNEND";
    } else {
        gso.state = "AGAIN";
    }

    return gso;
}

//
function moreDice(){
    gso.state = "TURNSTART";
    return gso;
}

//
function changePlayer(){
    // count score
    var score = scoreTable(activePlayer());
    var realScore = score.corgi - score.cabbage ;
    if(realScore>0){
        activePlayer().score += realScore;
    }
    // change player
    gso.players[0].active = !gso.players[0].active;
    gso.players[1].active = !gso.players[1].active;
    gso.state = "TURNSTART";
    return gso;
}

//
function msgReceived(arg){  
    switch(arg){
        case "Init":
            return initGame(); // GSO state: ANY
        case "Deal":
            return getDices(); // GSO state: DEALT
        case "Throw":
            return throwDices(); // GSO state: THROWN
        case "Count":
            return countScore(); // GSO state: TURNEND or AGAIN
        case "Again":
            return moreDice(); // GSO state: TURNSTART
        case "Change":
            return changePlayer(); // GSO state: TURNSTART
    }
};


/************* CHANGING GSO FOR TESTS PURPOSES ***************/
function setGSO(changedGSO){
    gso = changedGSO;
}

exports.msgReceived = msgReceived;
exports.setGSO = setGSO;