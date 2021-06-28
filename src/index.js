import mainView from './views/mainview.js';
import controlView from './views/controlview.js';
import gameView from './views/gameview.js';


import GameBrain from './model/gamebrain.js';
import GameController from './controllers/game-controller.js';
import StatisticsController from './controllers/statistics-controller.js';

let width = window.innerWidth;
let height = window.innerHeight - 50; // TODO: should change 50 (control area height), to something dynamic

let brain = new GameBrain(width, height);
let game_view = gameView();

let gameController = new GameController(brain, game_view);
let statisticsController = new StatisticsController(brain, game_view);

let view = mainView();
document.body.append(view);

let ctrl_view = controlView(gameControlCLick);

view.append(ctrl_view);
view.append(game_view);


function gameControlCLick(e){
    console.log(e);
    switch (e.target.id) {
        case 'game':
            console.log('gameControlClick - game');
            
            statisticsController.stop();
            gameController.run();

            break;
        case 'statistics':

            console.log('gameControlClick - statistics');
            gameController.stop();
            statisticsController.run();
            break;
    
        default:
            break;
    }
}

statisticsController.run();
//gameController.run();


let game = document.querySelector('#view-container');
game.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(e.target.className);
    console.log('target: ');
    console.log(e);
    if (e.target.type === 'submit') {
        let nameElem = document.querySelector('#name');
        let name = 'Player';

        if (nameElem && nameElem.value.trim().length > 0) {
            name = nameElem.value.trim();
            
        }
        console.log('submit');
        brain.setPlayerName(name);
    }else if (e.target.className === 'element') {
        console.log('move');
        console.log(game);
        gameController.move();
    } 
    e.preventDefault();
} );


window.addEventListener('resize', () => {
    gameController.resizeUi(window.innerWidth, window.innerHeight);
    //statisticsController.resizeUi();
});

document.addEventListener('keydown', (e) => {
    console.log(e);
    if (e.code === 'Space') {
        
        console.log('e.code: ' + e.code);
        gameController.move();
        e.preventDefault();
    }
});


