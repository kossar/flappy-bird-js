export default class ScoreBoard{
    constructor(size){
        this.scoreBoard = [];
        this.maxSize = size;
    }

    addScore(gameScore){
        if (this.scoreBoard.length === this.maxSize) {
            this.scoreBoard.pop();
        }

        this.scoreBoard.push(gameScore);
        this.scoreBoard.sort(this.compare);
        this.scoreBoard.reverse();
    }

    getScores(){
        this.scoreBoard.forEach( b => {
            console.log(b.score);
        }); 
        return this.scoreBoard;
    }
    compare(a, b) {
        if ( a.score < b.score ){
          return -1;
        }
        if ( a.score > b.score ){
          return 1;
        }
        return 0;
      }
}