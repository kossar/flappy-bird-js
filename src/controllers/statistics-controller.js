export default class StatisticsController{

    constructor(model, viewContainer){
        this.viewContainer = viewContainer;
        this.model = model;
        this.isRunning = false;
    }

    run(){
        console.log('run: ' + this.model);
        this.isRunning = true;
        this.viewContainer.innerHTML = '';
        this.viewContainer.append(this.gamePlayerDataContainer(this.model.getCurrentPlayerData().name));
        this.viewContainer.append(this.nameInputContainer(this.model.getCurrentPlayerData().name));
        this.viewContainer.append(this.infoContainer());
        this.viewContainer.append(this.statsListContainer(this.model.getScoreBoard()));
        this.viewContainer.style.paddingTop = '50px'; // TODO: should change this value to dynamic
        console.log('stats');
    }

    stop(){
        this.viewContainer.style.paddingTop = '';
        this.isRunning = false;
    }

    // resizeUi(){
    //     if (this.isRunning) {
    //         //redraw
    //     }
    // }

    nameInputContainer(currentName){
        let nameInputContainer = document.createElement('div');
        nameInputContainer.classList.add('container', 'input');

        let inputHeader = document.createElement('h4');
        inputHeader.innerText = 'Add your name or use default "Player"';
        nameInputContainer.append(inputHeader);

        let form = document.createElement('form');
        form.id = 'form';
        let nameInput = document.createElement('input');
        nameInput.id = 'name';
        nameInput.type = 'text';
        nameInput.name = 'player';
        nameInput.placeholder = currentName;
        form.append(nameInput);

        let submitButton = document.createElement('input');
        submitButton.value = 'Submit';
        submitButton.type = 'submit';
        submitButton.id = 'submit';
        
        form.append(submitButton);

        nameInputContainer.append(form);
        return nameInputContainer;
    }
    
    statsListContainer(scoreBoard){
        let statsContainer = document.createElement('div');
        statsContainer.classList.add('container', 'stats');

        let statsHeader = document.createElement('h4');
        statsHeader.innerText = 'Top scores';

        let statsTable = document.createElement('table');

        for (let index = 0; index < scoreBoard.length; index++) {
            let statsRow = document.createElement('tr');
            let posCol = document.createElement('td');
            let nameCol = document.createElement('td');
            let pointsCol = document.createElement('td');
            posCol.innerHTML = (index + 1);
            nameCol.innerHTML = scoreBoard[index].name;
            pointsCol.innerHTML = scoreBoard[index].score;
            statsRow.append(posCol);
            statsRow.append(nameCol);
            statsRow.append(pointsCol);

            statsTable.append(statsRow);
            
        }
        
        statsContainer.append(statsHeader);
        statsContainer.append(statsTable);
        return statsContainer;

    }

    infoContainer(){
        let infoContainer = document.createElement('div');
        infoContainer.classList.add('container', 'info');
        let info = document.createElement('p');
        info.innerHTML = "On desktop press <span class='bold'> space </span> to jump, on touchscreen <span class='bold'>tap</span>";
        infoContainer.append(info);
        return infoContainer;

        
    }

    gamePlayerDataContainer(name) {
        let dataContainer = document.createElement('div');
        dataContainer.classList.add('game-player-container');
    
        let nameContainer = document.createElement('p');
        nameContainer.id = 'player-name-stats';
        nameContainer.innerHTML = 'Current player: <span id="#current-player"> ' + name + '</span>';
        dataContainer.append(nameContainer);
    
    
        return dataContainer;
    }
    
}