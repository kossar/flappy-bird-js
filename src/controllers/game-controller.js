export default class GameController{
    constructor(model, viewContainer){
        this.viewContainer = viewContainer;
        this.model = model;
        this.isRunning = false;
        this.countDownStarted = false;
    }
    run(){
        
        if (!this.isRunning) {
            console.log('run game');
            this.countDownStarted = true;
            this.viewContainer.innerHTML = '';
            //this.model.resetBoard();
            this.viewContainer.append(this.getBoardHtml(this.model));
    
           this.viewContainer.append(this.getTimer()); 
           this.startGame(3);
        }
        

       // Start the game - param countdown time in sec
       
    }

    stop(){
        console.log('game stop');
        if (!this.isRunning) {
            this.countDownStarted = false;
        }
        this.isRunning = false;
        this.model.resetBoard();
    }

    pause(){
        this.isRunning = false;
        clearInterval(this.loopInterval);
        this.loopInterval = null;
    }
    move(){
        if (this.isRunning) {
            console.log('move - this.isRunning: ' + this.isRunning);
            this.model.moveUp();
        }
        
    }
    gameLoop(){
        let loopInterval = setInterval(() => {
            console.log('gameLoop');

            if (!this.isRunning) {
                console.log('clearinterval');
                clearInterval(loopInterval);
                return;
            }
            this.viewContainer.innerHTML = '';
            this.viewContainer.append(this.getBoardHtml(this.model));

        }, 300);
    }

    resizeUi(width, height){
        console.log(width, height);
        if (this.isRunning) {
            //redraw
            console.log('resize');
            //this.model.resize(width, height - 50);
            this.viewContainer.innerHTML = '';
            this.viewContainer.append(this.getBoardHtml(this.model));
        }
    }



    getBoardHtml(gameBrain){
        
       

        console.log('getBoardHtml, ' + this.isRunning);
        let content = document.createElement('div');
        let playerDataContainer = this.gamePlayerDataContainer();

        content.append(playerDataContainer);
        content.id = 'gameboard';
        content.style.display = 'flex';
        content.style.overflow = 'hidden';
        

        let colWidth = window.innerWidth / this.model.colCount;
        // 50 is a control-view height
        let rowHeight = (window.innerHeight - 50) / this.model.rowCount;
        gameBrain.getGameBoard().forEach(rowData => {
            //console.log(rowData);
            let colElem = this.getCol(rowData, colWidth, rowHeight, gameBrain);
                
            content.append(colElem);

            });
        
        let data = gameBrain.getCurrentPlayerData();
        let score = playerDataContainer.querySelector('#player-score');
        score.innerHTML = data.score + ' pts';
        let name = playerDataContainer.querySelector('#player-name');
        name.innerHTML = data.name;
        console.log('name' + data.name);
            
        if (!gameBrain.canMove()) {
            console.log('cant move');
            console.log('birdrow: ' + gameBrain.birdRow)
            this.stop();
            console.log('!can move end');
        }

        
        
        return content;
    }

    // Countdown timer
    startGame(durationInSec){
        let display = document.querySelector('#timer');

        let countDownInterval = setInterval(() => {
        console.log('countdown-inerval');
        display.textContent = durationInSec;
            
        if (!this.countDownStarted) {
            clearInterval(countDownInterval);
            display.parentElement.remove();
        }
        if (durationInSec === 0) {
            this.countDownStarted = false;
            clearInterval(countDownInterval);
            display.parentElement.remove();
            console.log('clear counter-interval');

            this.isRunning = true;
            this.gameLoop(); 
        }
        durationInSec--;
        }, 1000);
    }

    getCol(rowData, colWidth, rowHeight, gameBrain){
        let colElem = document.createElement('div');
            colElem.style.width = colWidth + 'px';
        for (let i = 0; i < rowData.length; i++) {
            
            let colData = rowData[i];

            let rowElem = document.createElement('div');
            rowElem.classList.add('element');
            if (colData === gameBrain.gameCellUp() && rowData[i + 1] === gameBrain.gameCellPath()){
                let pipe = document.createElement('img');
                pipe.src = './assets/pipe-upper.png';
                pipe.style.width = (colWidth * 3) + 'px';
                //pipe.style.height = (rowHeight * (rowData.length - i)) + 'px';
                pipe.style.bottom = '0';
                pipe.style.left = '0';
                pipe.style.zIndex = '10';
               
                pipe.style.position = 'absolute';

                rowElem.append(pipe);
                
            } else if (colData === gameBrain.gameCellDown() && rowData[i - 1] === gameBrain.gameCellPath()) {
                let pipe = document.createElement('img');
                pipe.src = './assets/pipe-down.png';
                pipe.style.width = (colWidth * 3) + 'px';
                //pipe.style.height = (rowHeight * (rowData.length - i)) + 'px';
                pipe.style.overflow = 'hidden';
                pipe.style.top = '0';
                pipe.style.left = '0';
                pipe.style.zIndex = '10';
               
                pipe.style.position = 'absolute';

                rowElem.append(pipe);
                
            } else if(colData === gameBrain.gameCellBird()){
                let bird = document.createElement('img');
                bird.style.backgroundColor = 'transparent';
                bird.src = './assets/grumpy-bird.gif';
                //bird.style.width = '100%';
                bird.style.width = (colWidth * 3) + 'px';
                bird.style.height = (rowHeight * 3) + 'px';
                bird.style.top = '0';
                bird.style.right = '0';
                bird.style.zIndex = '10';
                
                bird.style.position = 'absolute';
    
                rowElem.append(bird);
            }
            
            rowElem.style.height = rowHeight + 'px';
            rowElem.style.width = '100%';
            colElem.append(rowElem);
        }
        return colElem;
    }

    // Get timer html
    getTimer(){
        let startCountDown = document.createElement('div');
        startCountDown.id = 'timer-wrapper';
        startCountDown.style.position = 'absolute';
        startCountDown.style.left = '50%';
        startCountDown.style.top = '30%';
        startCountDown.style.transform = 'translate(-50%, 0)';
        

        let timer = document.createElement('p');
        timer.id = 'timer';
        timer.style.fontSize = '52px';
        timer.style.color = '#FFF';
        timer.style.fontWeight = '800';
        timer.style.fontFamily = 'Arial, Helvetica, sans-serif';
        //timer.innerText = '5';

        startCountDown.append(timer);
        return startCountDown;
    }
    gamePlayerDataContainer() {
        let dataContainer = document.createElement('div');
        dataContainer.classList.add('game-player-container');
    
        let nameContainer = document.createElement('p');
        nameContainer.id = 'player-name';
        dataContainer.append(nameContainer);
    
        let scoreContainer = document.createElement('p');
        scoreContainer.id = 'player-score';
        dataContainer.append(scoreContainer);
    
        return dataContainer;
    }
}