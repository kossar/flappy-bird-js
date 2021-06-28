import GameScore from './gamescore.js';
import ScoreBoard from './scoreboard.js';

export const gameCellPath = 0;
export const gameCellUp = -1;
export const gameCellDown = 1;
const gameCellBird = 2;

export default class GameBrain {
   

    constructor(uiWidth, uiHeight){
        this.rowCount = this.setBoardSize(uiHeight);
        this.colCount = this.setBoardSize(uiWidth);

        this.scoreBoard = new ScoreBoard(10); // of GameScore
        this.board = [];
        this.resizeCache = [];

        

        this.birdRow = Math.round((this.rowCount / 2) - 1);
        this.birdCol = Math.floor(this.colCount / 4);
        this.boardLastQuarter = Math.floor((this.colCount / 4) * 3);
        this.lastObstacle = 0;
        this.nextObstacle = 0;
        this.initializeBoard();
        this.currentScore = new GameScore();
        //this.setBoardSize();

    }

    setBoardSize(size){
        return Math.round(Math.floor(size) / 18);
    }

    createGameCol(pathPosition, pathHeight){
        let res = [];
       // console.log(res);
        for (let index = 0; index < this.rowCount; index++) {
            switch (true) {
                case index < pathPosition:
                    res.push(gameCellUp);
                    break;
                case index >= pathPosition + pathHeight:
                    res.push(gameCellDown);
                    break;
                default:
                    res.push(gameCellPath);
                    break;
            }
        }
        return res;

    }

    createNextFrame(){
        this.board.shift();
        this.lastObstacle--; // Decrease last obstacle for add
        this.addColElements(this.colCount-1);
    }


    initializeBoard(){
        console.log('initializeBoard()');
        this.lastObstacle = this.boardLastQuarter;  // Dummy last obstacle for starting calculations        

        for (let index = 0; index < this.colCount; index++) {
            if (index < this.boardLastQuarter) {
                this.board.push(this.createGameCol(0, this.rowCount)); // create empty columns for start
            }else{
                this.addColElements(index);
            }

        }
        this.birdRow = Math.round((this.rowCount / 2) - 1);
        this.board[this.birdCol][this.birdRow] = gameCellBird;
    }

    // Fills game column with elements
    addColElements(currentIndex){
        if (this.resizeCache.length > 0) {
            this.board.push(this.resizeCache.shift());
        } else {
            let randomDist = this.getRandomInt(18, 22);
            if(currentIndex - this.lastObstacle >= randomDist){
                
                let randomPathPos = this.getRandomInt(10, this.rowCount / 2);
                let randomPathHeight = this.getRandomInt(6, this.rowCount - randomPathPos);
                this.board.push(this.createGameCol(randomPathPos, randomPathHeight));

                this.lastPathHeight = randomPathHeight;
                this.lastObstacle = currentIndex;
                
            } else{
                this.board.push(this.createGameCol(0, this.rowCount)); 
            }
        }
        
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
      }

    
    resetBoard(){
        this.board = [];
        this.initializeBoard();
    }
    getGameBoard(){
        this.createNextFrame();
        this.moveBird();
        this.addPoints();
        return this.board;
    }
    moveBird(){

        //Replace old bird location
        this.board[this.birdCol - 1][this.birdRow] = gameCellPath;
        // Subtract to birdrow to simulate bird falling(adding to index)
        this.birdRow++;
        // Add bird to new location
        this.board[this.birdCol][this.birdRow] = gameCellBird;
    }

    canMove(){
        if (this.birdRow + 2 >= this.rowCount) {
            this.savePlayerData();
            return false;
        }

        if (this.birdRow < 0) {
            this.birdRow = 0;
            this.savePlayerData();
            return false;
        }
        let colBird = this.birdCol - 3;
        console.log('colbird: ' + colBird);
        let rowBird = this.birdRow;
        for (let col = colBird; col <= this.birdCol + 1; col++) {
            for (let row = rowBird; row <= this.birdRow + 2; row++) {
                if (this.board[col][row] === gameCellUp || this.board[col][row] === gameCellDown) {
                    this.savePlayerData();
                    return false;
                }
                
            }
            
        }
        return true;
    }
    savePlayerData(){
        // If cant move anymore add game score to scoreboard
        this.scoreBoard.addScore(this.currentScore);
        // Save player name for possible use in next game
        let oldName = this.currentScore.name;
        // Create new score instance
        this.currentScore = new GameScore();
        // Set new score instance name with previous name, in case player doesnt want to change it 
        this.currentScore.name = oldName;
   }
    
    moveUp(){
        let newRow = this.birdRow - 6;
        this.board[this.birdCol][this.birdRow] = gameCellPath;
        this.birdRow = newRow;
        this.board[this.birdCol][this.birdRow] = gameCellBird;
        // if (newRow >= 0) {
           
        //     return true;
        // }
        
        // if (this.birdRow < 0) {
        //     this.birdRow = 0;
        //     return false;
        // }
        
    }
    gameCellPath(){
        return gameCellPath;
    }

    gameCellUp(){
        return gameCellUp;
    }

    gameCellDown(){
        return gameCellDown;
    }

    gameCellBird(){
        return gameCellBird;
    }

    setPlayerName(name){
        console.log('setPlayerName: ' + name);
        this.currentScore.name = name;
    }

    // resize(uiWidth, uiHeight){
    //     console.log(uiHeight. uiWidth);
    //     console.log('resize(uiWidth, uiHeight)');
    //     let newColCount = this.setBoardSize(uiWidth);
    //     let newRowCount = this.setBoardSize(uiHeight);
    //     console.log('newColCount ' + newColCount + 'newRowCount' + newRowCount);

    //     if (newRowCount < this.rowCount) {
           
    //         this.board.forEach(row => {
    //             row = row.slice(0, newRowCount - 1);
    //         });
    //         this.rowCount = newRowCount;
    //     }else if (newRowCount > this.rowCount) {
            
    //         this.board.forEach(row => {
    //             let el = row[this.rowCount - 1];
    //             for (let index = this.rowCount; index < newRowCount; index++) {
    //                 row.push(el);
                    
    //             }
    //         });
    //         this.rowCount = newRowCount;
    //     }

    //     if (newColCount < this.rowCount) {
    //         console.log('newColCount < this.rowCount');
    //         let currentArr = this.board.slice(newColCount -1);
    //         this.resizeCache = this.board.slice(newColCount);
    //         this.board = currentArr;
    //         this.colCount = newColCount;
    //     }

    //     console.log(this.board.length);
    // }
    getScoreBoard(){
        return this.scoreBoard.getScores();
    }
    addPoints(){
        if (this.board[this.birdCol - 5][0] === gameCellUp) {
            this.currentScore.score++;
            console.log('score: ' + this.currentScore.score);
        }
    }

    getCurrentPlayerData(){
        console.log('this.getCurrentPlayerData ' + this.currentScore.name)
        return this.currentScore;
    }
}