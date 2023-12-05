let inputs = document.querySelectorAll('.grid-input');
let btnSolve = document.querySelector('.solve');
let btnClear = document.querySelector('.clear');
// let btnFill = document.querySelector('#fill');
let grid = document.querySelector('.puzzle');
let recursionCounter = 0;
let intervalID;
const RECURSIONLIMIT = 10000;
const LIMITON = false;
// btnFill.addEventListener('click', ()=>{
//     let puzzle = getInitialValue();
//     fillCells(puzzle);
//     displayPuzzle(puzzle);
// });

btnSolve.addEventListener('click', ()=>{ 
    let puzzle = getInitialValue();
    console.table(puzzle);
    intervalID = setInterval(displayPuzzle, 10, puzzle);

    if(solve(puzzle)){
        clearInterval(intervalID);
        alert('Puzzle Solved.');
    }
    else{
        clearInterval(intervalID);
        alert('Puzzle is unsolvable.');
    }
});
btnClear.addEventListener('click', ()=>{ clear();});

inputs.forEach(input => {
    input.addEventListener('change', (e)=>{
        if(e.target.value == 0 || e.target.value === ''){
            e.target.value = ''
            e.target.classList.remove('userInput');
            return;
        } 
        e.target.classList.add('userInput');
    });
});

function getInitialValue(){
    let ret =  [[0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0]];
    // let ret = [[8,0,4,0,5,7,0,0,0],  
    //             [0,0,0,8,0,0,0,4,0],
    //             [0,0,0,1,0,4,0,7,8],
    //             [9,0,0,6,0,0,0,5,0],
    //             [4,0,5,0,0,0,6,0,3],
    //             [0,8,0,0,0,5,0,0,9],
    //             [5,2,0,4,0,1,0,0,0],
    //             [0,4,0,5,0,8,0,0,0],
    //             [0,0,0,3,9,0,0,0,0]];
    
    inputs.forEach(cell => {
        let id = cell.getAttribute('id');
        let row = parseInt(id.substring(0,1));
        let col = parseInt(id.substring(1));
        let value = document.getElementById(id).value;
        // if(isNaN(cell.getAttribute('value'))) console.log('Not a number: ' + cell.getAttribute('value'));
        ret[row][col] = value == '' ? 0 : parseInt(value);

    });
    recursionCounter = 0;
    return ret;
}

function solve(puzzle){
    recursionCounter++;
    console.log(`Recursion counter: ${recursionCounter}`)
    // console.log("Recursion Counter: " + recursionCounter);
    // setTimeout(displayPuzzle, 10, puzzle);
    // setTimeout(displayPuzzle,1,puzzle);
    displayPuzzle(puzzle);
    if((recursionCounter > RECURSIONLIMIT) && LIMITON){
        console.log("Recursion Limit");
        return true;
    }    
    // find the next empty cell; returns true if there is no remaining empty cell
    let emptyCell = findEmptyCell(puzzle);

    // if there is no remaining empty cell, return true
    if(emptyCell === true){
        console.log('Puzzle Solved');
        console.table(puzzle);
        return true;
    }

    for (let i = 1; i <= 9; i++) {
        // validate function will check if the value i is valid in the next cell; 
        // if it is valid, the value will be inserted to the puzzle and the recursion will happen.
        if(validatePuzzle(puzzle, emptyCell, i)){
            console.log(`inserting value: ${i} in Cell [${emptyCell.row}][${emptyCell.col}].`);
            puzzle[emptyCell.row][emptyCell.col] = i;
            // recursive function. returns true if there are no remaining cells 
            if(solve(puzzle)) return true;
            else puzzle[emptyCell.row][emptyCell.col] = 0;
        }
    }
    return false;
}

function clear(){
    inputs.forEach(cell => {
        cell.classList.remove('userInput');
        cell.value = '';
    });

}

function displayPuzzle(puzzle){
    for(let i = 0 ; i < puzzle.length; i++){
        for (let j = 0; j < puzzle[i].length; j++) {
            let id = '' + i + j;
            let cell = document.getElementById(id);
            cell.value = puzzle[i][j] === 0 ? '' : puzzle[i][j];
        }
    }
}

function findEmptyCell(puzzle){
    for(let i = 0 ; i < puzzle.length; i++){
        for (let j = 0; j < puzzle[i].length; j++) {
            if(puzzle[i][j] === 0)
                return {row:i,col:j};
        }
    }
    return true;
}

function fillCells(puzzle){
    for(let i = 0 ; i < puzzle.length; i++){
        for (let j = 0; j < puzzle[i].length; j++) {
            puzzle[i][j] = 1;
        }
    }   
}

function validatePuzzle(puzzle, cellToCheck, digit){
    // console.table(puzzle,cellToCheck, digit);
    //check row
    if(puzzle[cellToCheck.row].indexOf(digit) !== -1) return false;
    //check col
    for (let index = 0; index < 9; index++) {
        if(puzzle[index][cellToCheck.col] === digit) return false;
    }
    //check 3x3
    let bigSquareRow = Math.floor(cellToCheck.row/3) * 3;
    let bigSquareCol = Math.floor(cellToCheck.col/3) * 3;

    for (let i = bigSquareRow; i < bigSquareRow + 3; i++) {
        for (let j = bigSquareCol; j < bigSquareCol + 3; j++) {
            if(puzzle[i][j] === digit) return false;
        }
    }

    return true;
}