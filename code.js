let rows = 15;
let cols = 15;
let cellSize = 20;
let playing = false;

let timer;
let reproductionTime = 500;
let standardRules = true; 

let grid = new Array(rows);
let nextGrid = new Array(rows);

let currentSkin = 'skin1';

document.addEventListener('DOMContentLoaded', () => {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
    setupResolutionControls();
    setupCellSizeControl();
    setupRuleToggle();
    setupSkinToggle();
});

function setupSkinToggle() {
    document.querySelector('#skin1').onclick = () => {
        currentSkin = 'skin1';
        applySkin();
    };

    document.querySelector('#skin2').onclick = () => {
        currentSkin = 'skin2';
        applySkin();
    };
}

function applySkin() {
    document.body.classList.remove('skin1', 'skin2');
    document.body.classList.add(currentSkin);
    updateView();
}

function setupRuleToggle() {
    document.querySelector('#standardRules').onclick = () => {
        standardRules = true;
        alert('Standardní pravidla zapnuta');
    };

    document.querySelector('#customRules').onclick = () => {
        standardRules = false;
        alert('Custom pravidla zapnuta');
    };
}

function setupControlButtons() {
    let startButton = document.querySelector('#start');
    let clearButton = document.querySelector('#clear');
    let randomButton = document.querySelector('#random');

    startButton.onclick = () => {
        if (playing) {
            playing = false;
            startButton.innerHTML = 'Pokračovat';
        } else {
            playing = true;
            startButton.innerHTML = 'Pauza';
            play();
        }
    };

    clearButton.onclick = () => {
        playing = false;
        startButton.innerHTML = "Start";
        resetGrids();
    };

    randomButton.onclick = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = Math.random() < 0.5 ? 0 : 1;
                document.getElementById(i + "_" + j).className = grid[i][j] ? "live" : "dead";
            }
        }
    };
}

function setupResolutionControls() {
    document.querySelector('#applyResolution').onclick = () => {
        rows = parseInt(document.querySelector('#rowsInput').value) || rows;
        cols = parseInt(document.querySelector('#colsInput').value) || cols;
        initializeGrids();
        createTable();
        resetGrids();
    };
}

function setupCellSizeControl() {
    document.querySelector('#small').onclick = () => {
        cellSize = 10;
        createTable();
    };

    document.querySelector('#medium').onclick = () => {
        cellSize = 20;
        createTable();
    };

    document.querySelector('#large').onclick = () => {
        cellSize = 30;
        createTable();
    };
}

function createTable() {
    let gridContainer = document.getElementById("gridContainer");
    if (!gridContainer) {
        console.error("Problem: no div for the grid table!");
    }
    let table = document.createElement("table");
    table.classList.add("grid");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            cell.style.width = cellSize + "px";
            cell.style.height = cellSize + "px";
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.innerHTML = "";
    gridContainer.appendChild(table);
}

function cellClickHandler() {
    let [row, col] = this.id.split("_").map(Number);
    let classes = this.getAttribute('class');
    if (classes.indexOf('live') > -1) {
        this.setAttribute('class', 'dead');
        grid[row][col] = 0;
    } else {
        this.setAttribute('class', 'live');
        grid[row][col] = 1;
    }
}

function resetGrids() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
    updateView();
}

function initializeGrids() {
    grid = new Array(rows);
    nextGrid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function play() {
    computeNextGen();
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
}

function applyRules(i, j) {
    let neighbors = countLiveNeighbors(i, j);
    let currentState = grid[i][j];
    if (currentState === 1) {
        if (neighbors < 2 || neighbors > 3) {
            nextGrid[i][j] = 0;
        } else {
            nextGrid[i][j] = 1; 
        }
    } else if (currentState === 0 && neighbors === 3) {
        nextGrid[i][j] = 1; 
    }
}

function countLiveNeighbors(i, j) {
    let count = 0;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            let ni = i + x;
            let nj = j + y;
            if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                count += grid[ni][nj];
            }
        }
    }
    return count;
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
        }
    }
}

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(i + "_" + j);
            if (grid[i][j] === 1) {
                cell.setAttribute("class", "live");
            } else {
                cell.setAttribute("class", "dead");
            }
        }
    }
}
