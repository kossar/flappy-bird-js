export default function controlView(eventHandler){
    let control = document.createElement('div');
    control.style.height = '50px'; // set height of control view to calculate gameboard height
    control.id = 'control';

    let statisticsButton = document.createElement('button');
    statisticsButton.id = 'statistics';
    statisticsButton.innerText = 'Statistics';

    let gameButton = document.createElement('button');
    gameButton.id = 'game';
    gameButton.innerText = 'Game';

    control.append(statisticsButton);
    control.append(gameButton);

    statisticsButton.addEventListener('click', eventHandler);
    gameButton.addEventListener('click', eventHandler);
    return control;
}