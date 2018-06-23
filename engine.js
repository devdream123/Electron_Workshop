// Require the gso template and the dices to throw
const dice =  require("./src/data/dice.json");
var gso =  require("./src/data/gso.json");

/************* HELPERS ***************/
// Helper to get random number up to given
function getRandomUpTo(n){
    return Math.round((Math.random() * n));
}

// Helper to make sure we get random dices
function getRandomDice(board){
    var newDice;
    do {
        var diceIndex = getRandomUpTo(12);
        newDice = dice["dice"+diceIndex]["name"];
    } while(board.dealt.indexOf(newDice) != -1 || 
            board.hand.map(x => x.name).indexOf(newDice.name) != -1);

    return newDice;
}


// Helper to throw 1 of 6 sides of this dice
function throwRandomSides(board){
    board.dealt.forEach(function(diceName){
        var playersDice = dice[diceName];
        var result = {name: playersDice["name"], side : playersDice.sides[getRandomUpTo(5)]};
        board.thrown.push(result);
    });
    board.dealt = [];
    return board;
}


// Check and count the results
function parseThrowResults(board){
    board.thrown.forEach(function(playersDice){
        if(playersDice.side=="paws"){
            board.dealt.push(playersDice.name);
        } else {
            board.hand.push(playersDice);
        }
    });

    board.thrown = [];
    return board;
}

// Check the number of points for cabbages and corgis
function scoreTable(board){
    var score = {
        "corgi" : 0,
        "cabbage" : 0
    }

    board.hand.forEach(function(playerDice){
        score[playerDice.side] += 1;
    });

    return score;
}

/************* GAME STATES ***************/
// The initial state of the game
function initGame(){
    return gso;
}

// Give dices to player based on his previous actions
function getDices(){
    var diceNeeded = 3-gso.board["dealt"].length;
    for(var i=0; i<diceNeeded; i++) {
        gso.board["dealt"].push(getRandomDice(gso.board));
    }

    gso.state = "DEALT";
    return gso;
}

// Assign sides to dices
function throwDices(){
    throwRandomSides(gso.board);
    gso.state = "THROWN";
    return gso;
}


// 
function countScore(){
    var playerWithResults = parseThrowResults(gso.board);
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
    var score = scoreTable(gso.board);
    var realScore = score.corgi - score.cabbage ;

    const activePlayer = gso.players[0].active ? gso.players[0] : gso.players[1];
    if(realScore>0){
        activePlayer.score += realScore;
    }

    // reset board
    gso.board.dealt = [];
    gso.board.thrown = [];
    gso.board.hand = [];
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