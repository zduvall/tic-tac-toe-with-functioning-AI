window.addEventListener("DOMContentLoaded", () => {

    // create variables that have the image element as a string
    const xImage = '<img src="https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg"></img>';
    const oImage = '<img src="https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg"></img>';

    // Variables for different elements
    const header = document.getElementById('game-status');
    const newGameButton = document.getElementById('new-game');
    const giveUpButton = document.getElementById('give-up')
    const computerChooseButton = document.getElementById('computer-choose')
    const playerTracker = document.getElementById('player-tracker')
    let TTTboardDiv = document.getElementById('tic-tac-toe-board')

    // Array to represent the board:
    // [[[0][0], [0][1], [0][2]],
    //  [[1][0], [1][1], [1][2]],
    //  [[2][0], [2][1], [2][2]]]
    let TTTboardArr = [[00, 01, 02], [10, 11, 12], [20, 21, 22]]

    // counter to keep track of whose turn it is
    let count = 1;

    // objects to keep track of count in each column and each row
    let xObject = {};
    let oObject = {};
    // arrays to keep track of the row/column pairs (which of the 9 squares was clicked)
    let xArray = [];
    let oArray = [];

    // we only hit this when we refresh and have data in local storage (refresh in middle of a game)
    if (localStorage.length > 0) {
        // access and reset stored variables
        count = localStorage.getItem('count');
        TTTboardDiv.innerHTML = localStorage.getItem('TTTboardDivInnerHTML');
        TTTboardArr = JSON.parse(localStorage.getItem('TTTboardArr'));
        xObject = JSON.parse(localStorage.getItem("xObject"));
        oObject = JSON.parse(localStorage.getItem("oObject"));

        // set player tracker to the right turn
        if (count % 2 === 0) {
            playerTracker.innerHTML = "O's Turn"
        } else {
            playerTracker.innerHTML = "X's Turn"
        }

        // check if there is a winner, in case you hit refresh after winning but before new game 
        // (and decrement count because checkWin inrements it)
        count--;
        checkWin();

        // check if there was a give up state, in case you hit refresh after giving up but before new game
        if (localStorage.getItem('giveUpState') === 'true') {
            giveUpButtonClick()
        }
    }

    // things that would need to be updated using info from local storage upon refresh
    // the squares divs
    const squares = document.querySelectorAll('.square');



    // At this point, we're done with all the variables 

    // What happens when you click on one of the Tic Tac Toe squares
    squares.forEach(square => {
        square.addEventListener("click", event => {

            // set variables to get the numbers from the DIV's id to use for index below
            firstIndex = event.target.id[0];
            secondIndex = event.target.id[1];

            // check to make sure div has no image in it header.innerHTML is still title
            if (event.target.tagName !== 'IMG' && header.innerHTML === 'Tic Tac Toe') {
                // grab row and column classes from current event target
                const [_, row, col] = event.target.classList
                // O's Turn
                if (count % 2 === 0) {
                    // change turn indicator
                    playerTracker.innerHTML = "X's Turn"
                    // put oImage into div
                    event.target.innerHTML = oImage;
                    // put O into array at correct index
                    TTTboardArr[firstIndex][secondIndex] = 'O'
                    // update oObject
                    updateObjArrLocalStorage(oObject, oArray, row, col, firstIndex, secondIndex)
                }
                // X's Turn
                else {
                    playerTracker.innerHTML = "O's Turn"
                    // put xImage into div
                    event.target.innerHTML = xImage;
                    // put O into array at correct index
                    TTTboardArr[firstIndex][secondIndex] = 'X'
                    // update xObject
                    updateObjArrLocalStorage(xObject, xArray, row, col, firstIndex, secondIndex)
                }
            }
        })
    })

    // helper functions for updating objects
    function updateObjArrLocalStorage(curObject, curArray, curRow, curCol, curFirstIndex, curSecondIndex) {
        // update the array
        curArray.push([curRow, curCol]);

        if (curObject[curRow]) {
            curObject[curRow]++;
        } else {
            curObject[curRow] = 1;
        }
        if (curObject[curCol]) {
            curObject[curCol]++;
        } else {
            curObject[curCol] = 1;
        }
        // add or increment top left to bottom right diagnoal
        if ((curFirstIndex == 0 && curSecondIndex == 0)
            || (curFirstIndex == 1 && curSecondIndex == 1)
            || (curFirstIndex == 2 && curSecondIndex == 2)) {
            if (curObject['TLtoBR']) {
                curObject['TLtoBR']++;
            } else {
                curObject['TLtoBR'] = 1;
            }
        }
        // add or increment bottom left to top right diagnoal
        if ((curFirstIndex == 2 && curSecondIndex == 0)
            || (curFirstIndex == 1 && curSecondIndex == 1)
            || (curFirstIndex == 0 && curSecondIndex == 2)) {
            if (curObject['BLtoTR']) {
                curObject['BLtoTR']++;
            } else {
                curObject['BLtoTR'] = 1;
            }
        }
        // add objects and arrasy to local storage
        localStorage.setItem("xObject", JSON.stringify(xObject));
        localStorage.setItem("oObject", JSON.stringify(oObject));
        localStorage.setItem("xArray", JSON.stringify(xArray));
        localStorage.setItem("oArray", JSON.stringify(oArray));
        // update local storage with inner HTML of TTTboard
        localStorage.setItem('TTTboardDivInnerHTML', TTTboardDiv.innerHTML);
        localStorage.setItem('TTTboardArr', JSON.stringify(TTTboardArr));
        // check if someone won
        checkWin();
    }


    // this is the old way I was checking if someone won
    // function checkWin() {
    //     // check all possible ways of winning
    //     if (TTTboardArr[0][0] === TTTboardArr[0][1] && TTTboardArr[0][1] === TTTboardArr[0][2]      // first three lines are winning row combos
    //         || TTTboardArr[1][0] === TTTboardArr[1][1] && TTTboardArr[1][1] === TTTboardArr[1][2]
    //         || TTTboardArr[2][0] === TTTboardArr[2][1] && TTTboardArr[2][1] === TTTboardArr[2][2]
    //         || TTTboardArr[0][0] === TTTboardArr[1][0] && TTTboardArr[1][0] === TTTboardArr[2][0]   // next three lines are winning column combos
    //         || TTTboardArr[0][1] === TTTboardArr[1][1] && TTTboardArr[1][1] === TTTboardArr[2][1]
    //         || TTTboardArr[0][2] === TTTboardArr[1][2] && TTTboardArr[1][2] === TTTboardArr[2][2]
    //         || TTTboardArr[0][0] === TTTboardArr[1][1] && TTTboardArr[1][1] === TTTboardArr[2][2]   // last two lines are winning diagonal combos
    //         || TTTboardArr[2][0] === TTTboardArr[1][1] && TTTboardArr[1][1] === TTTboardArr[0][2]) {

    //         if (count % 2 === 0) {  // 'O' player's turn (when count % 2 is 0)
    //             header.innerHTML = 'Winner O!';
    //         } else {                // 'X' player's turn (when count % 2 isn't 0)
    //             header.innerHTML = 'Winner X!';
    //         }
    //         // upon a winner, enable new game button and disable give up button
    //         newGameButton.disabled = false;
    //         giveUpButton.disabled = true;
    //         // change player tracker to say game over
    //         playerTracker.innerHTML = 'Game Over'
    //     }
    //     // if all squares are filled and there isn't a winner, then it's a tie
    //     if (count == 9 && header.innerHTML === 'Tic Tac Toe') {
    //         header.innerHTML = 'Tie Game!';
    //         // upon a tie, enable new game button and disable give up button
    //         newGameButton.disabled = false;
    //         giveUpButton.disabled = true;
    //         // change player tracker to say game over
    //         playerTracker.innerHTML = 'Game Over'
    //     }
    // }

    function checkWin() {
        // comment in this line below if you want to be able to see how the TTTboardArr changes with time
        // console.log(TTTboardArr, xObject, oObject);

        // check if any element in X and O objects has 3
        if (count % 2 === 0) {  // 'O' player's turn (when count % 2 is 0)
            for (let key in oObject) {
                if (oObject[key] === 3) {
                    header.innerHTML = 'Winner O!';
                    // upon a winner, enable new game button and disable give up button, disable computer choose button
                    newGameButton.disabled = false;
                    giveUpButton.disabled = true;
                    computerChooseButton.disabled = true;
                    // change player tracker to say game over
                    playerTracker.innerHTML = 'Game Over';
                }
            }
        } else {                // 'X' player's turn (when count % 2 isn't 0)
            for (let key in xObject) {
                if (xObject[key] === 3) {
                    header.innerHTML = 'Winner X!';
                    // upon a winner, enable new game button and disable give up button, disable computer choose button
                    newGameButton.disabled = false;
                    giveUpButton.disabled = true;
                    computerChooseButton.disabled = true;
                    // change player tracker to say game over
                    playerTracker.innerHTML = 'Game Over';
                }
            }
        }

        // if all squares are filled and there isn't a winner, then it's a tie
        if (count == 9 && header.innerHTML === 'Tic Tac Toe') {
            header.innerHTML = 'Tie Game!';
            // upon a tie, enable new game button, disable give up button, disable computer choose button
            newGameButton.disabled = false;
            giveUpButton.disabled = true;
            computerChooseButton.disabled = true;
            // change player tracker to say game over
            playerTracker.innerHTML = 'Game Over'
        }
        // increment count
        count++;
        // update count in local storage
        localStorage.setItem('count', count)
    }


    // here's what happens when you click new game (note, this button is only available after game over or give up)
    newGameButton.addEventListener('click', () => {

        // reset TTTboardArr, reset count, reset header, re-disable the new game button, enable give up button
        TTTboardArr = [[00, 01, 02], [10, 11, 12], [20, 21, 22]];
        count = 1;
        header.innerHTML = 'Tic Tac Toe';
        newGameButton.disabled = true;
        giveUpButton.disabled = false;
        computerChooseButton.disabled = false;

        // reset X and O objects and arrays
        xObject = {};
        oObject = {};
        xArray = [];
        oArray = [];

        // reset player tracker
        playerTracker.innerHTML = "X's Turn"

        // clear out the images
        squares.forEach(square => {
            square.innerHTML = ''
        })

        // clear storage
        localStorage.clear();
    })


    // here's what happens when someone gives up
    giveUpButton.addEventListener('click', giveUpButtonClick)

    function giveUpButtonClick() {
        // increment count at this point to determine winner correctly
        count++;
        // update count in local storage
        localStorage.setItem('count', count)

        // winner based on who gives up (% to determine player's turn is opposite from above b/c above we run the % check after inrementing on click)
        if (count % 2 === 0) {      // X gives up on his/her turn, so O player wins
            header.innerHTML = 'Winner O!';
        } else {                    // O gives up on his/her turn, so X player wins
            header.innerHTML = 'Winner X!';
        }

        // enable new game button and disable give up button
        giveUpButton.disabled = true;
        newGameButton.disabled = false;
        computerChooseButton.disabled = false;
        // change player tracker to say game over
        playerTracker.innerHTML = 'Game Over'

        // store give up state in case of refresh
        localStorage.setItem('giveUpState', 'true')
    }








    // the problem is that the click saves up somehow until it finds two in a row, and 
    // then it executes that same number again on computerChooseButton


    // what happens when you click computer choose
    computerChooseButton.addEventListener('click', computerChoose);

    // arrays to help the computer determine what's available (they have to be strings so we can index them)
    const TTTboardIndicesArray = ['00', '01', '02', '10', '11', '12', '20', '21', '22'];
    const row1Arr = ['00', '01', '02'];
    const row2Arr = ['10', '11', '12'];
    const row3Arr = ['20', '21', '22'];
    const col1Arr = ['00', '10', '20'];
    const col2Arr = ['01', '11', '21'];
    const col3Arr = ['02', '12', '22'];
    const TLtoBRArr = ['00', '11', '22'];
    const BLtoTRArr = ['20', '11', '02'];

    // logic for computer to pick a spot
    function computerChoose() {
        if (count % 2 === 0) {
            // if xObject has 2 aligned and there is a third empty spot, play there
            if (compChooseIfTwoXs()) { return }
            // otherwise if oObject has 2 aligned and there is a third empty spot, play there
            else if (compChooseIfTwoOs()) { return }
            // otherwise, play in random open spot
            else { compChooseRandom() }
        }
        else {
            // if oObject has 2 aligned and there is a third empty spot, play there
            if (compChooseIfTwoOs()) { return }
            // otherwise if xObject has 2 aligned and there is a third empty spot, play there
            else if (compChooseIfTwoXs()) { return }
            // otherwise, play in random open spot
            else { compChooseRandom() }
        }
    }

    // function for computer to check if oObject has 2 in a row and if the third is open
    function compChooseIfTwoOs() {
        for (let key in oObject) {
            if (oObject[key] === 2) {
                const winningKeyArr = eval(`${key}Arr`);
                winningKeyArr.forEach(el => {
                    if (TTTboardArr[el[0]][el[1]] !== 'X'
                        && TTTboardArr[el[0]][el[1]] !== 'O') {
                        placeComputerChoice(el[0], el[1]);
                        return true;
                    }
                });
            }
        }
    }

    // function for computer to check if xObject has 2 anywhere and if the third is open
    function compChooseIfTwoXs() {
        for (let key in xObject) {
            if (xObject[key] === 2) {
                const winningKeyArr = eval(`${key}Arr`);
                winningKeyArr.forEach(el => {
                    if (TTTboardArr[el[0]][el[1]] !== 'X'
                        && TTTboardArr[el[0]][el[1]] !== 'O') {
                        placeComputerChoice(el[0], el[1]);
                        return true;
                    }
                });
            }
        }
    }

    // function for computer to choose a random square
    function compChooseRandom() {
        indexCheck = TTTboardIndicesArray[Math.floor(Math.random() * TTTboardIndicesArray.length)];
        firstIndexCheck = indexCheck[0];
        secondIndexCheck = indexCheck[1];
        // check if it's available, and if not, recurse
        if (TTTboardArr[firstIndexCheck][secondIndexCheck] !== 'X'
            && TTTboardArr[firstIndexCheck][secondIndexCheck] !== 'O') {
            placeComputerChoice(firstIndexCheck, secondIndexCheck);
        } else {
            compChooseRandom();
        }
    }


    // function for computer to place it's choice
    function placeComputerChoice(pccFirstIndex, pccSecondIndex) {
        // O's turn
        if (count % 2 === 0) {
            // if oObject has 2 anywhere play O in the spot to make it 3
            // otherwise if oObject has 2 anywhere play X in the spot to block
            // otherwise, play in random open spot
            const compPlaceOat = document.getElementById(`${pccFirstIndex}${pccSecondIndex}`);
            compPlaceOat.innerHTML = oImage;
            const [_, row, col] = compPlaceOat.classList;
            TTTboardArr[pccFirstIndex][pccSecondIndex] = 'O';
            playerTracker.innerHTML = "X's Turn";
            updateObjArrLocalStorage(oObject, oArray, row, col, pccFirstIndex, pccSecondIndex);
        }
        // X's Turn
        else {
            // if xObject has 2 anywhere play X in the spot to make it 3
            // otherwise if oObject has 2 anywhere play X in the spot to block
            // otherwise, play in random open spot
            const compPlaceXat = document.getElementById(`${pccFirstIndex}${pccSecondIndex}`);
            compPlaceXat.innerHTML = xImage;
            const [_, row, col] = compPlaceXat.classList;
            TTTboardArr[pccFirstIndex][pccSecondIndex] = 'X';
            playerTracker.innerHTML = "O's Turn";
            updateObjArrLocalStorage(xObject, xArray, row, col, pccFirstIndex, pccSecondIndex);
        }
    }
})


