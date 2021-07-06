import React, {FC, useState, useEffect} from 'react';
import Card from './components/Card';
import './App.css';
import RightSection from './components/RightSection/';
import { useDispatch, useSelector } from 'react-redux';
import { InitialState, State } from './state/reducers/userReducer';
import { shuffleCards, arrayOfSize, getFormattedTime} from './components/functions';

const App: FC = () => {
  const gridLen = 4; // "n" for n X n grid
  //=================================================================================================================
  // Because runtime/game-settings related states are not drilled deeper in component tree, these are not stored in Redux store for now
  //=================================================================================================================

  // Array of cards used in the grid, initially shuffled with values.
  const [cardArr, setCardArr] = useState(() => {return shuffleCards(arrayOfSize(gridLen));});
  
  //===============================================================================================================
  // The idea is:
  // For n in n X n grid, say (n = 4), so,
  // gridLen = 4
  // arrayofSize(gridLen) returns an array with size of 4 * 4 = 16 containing [0,1,2,3,....,15]
  // shuffleCards(array) takes that array and randomly shuffles the array elements
  // So that cardArr above contains that shuffled array.
  // Now, index 0 of that array is the first card which has the value of cardArr[index] and so on. So each card has randomly shuffled values
  // ------------
  // Every Card component holds its index (position) in the grid and its value (that shuffled value).
  // ...Because we want matching pairs,
  // ... I divided the linear values into 2 matching values. So, for 16 card configuration::
  //......... the shuffled array, say for now is [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] which then becomes [0,1,2,3,4, 5, 6, 7, 0,1,2,3,4,5,6,7]..
  // ........ that way, always exactly two cards will have the same value. Which is then used to match the pairs.
  //================================================================================================================== 

  // State to store the ticking time in seconds, which is later formatted to render
  const [timeValue, setTimeValue] = useState(0);

  //to store the no of states the player is taking to finish matching all pairs
  const [step, setStep] = useState(0);

  // storing the flag to whether start the game by enabling all cards or to disable the game.
  const [start, setStart] = useState(false);
  
  // storing all the matched cards during this gameplay
  const [matchedCards, setMatchedCards] = useState<HTMLDivElement[]>([]);

  // Storing the opened cards. Only two cards can be placed here in maximum.
  // If the two opened cards match, they are moved to matchedCards array.
  const [openedCards, setOpenedCards] = useState<HTMLDivElement[]>([]);

  // Users from the Redux store
  const userState: InitialState = useSelector((state: State) => state).userState;
  
  // Initializing dispatch function for throwing out actions when needed
  const dispatch = useDispatch();

  // A function used to start the game, which is handler for "Start" button
  // Similarly, the start button reloads the game with new shuffled cards after one gameplay is done
  const startGame = () => {
    if (matchedCards.length === cardArr.length){
      resetGame();
    }
    setStart(true);
  }

  // Function to reset the game, which is a handler for "Reset" button
  const resetGame = () => {
    // Remove all matched pairs and flip the pairs back
    // Remove opened cards (if any) and flip the cards back
    // Re-shuffle the values and store in cardArr
    // Reset the steps and timer values to 0

    matchedCards.forEach((card) => {
      card.classList.remove("matched");
      card.classList.remove("visibleState");

    });

    openedCards.forEach((card) => {
      // card.classList.remove("matched");
      card.classList.remove("visibleState");

    });

    setCardArr(shuffleCards(arrayOfSize(4)));
    setStep(0);
    setOpenedCards([]);
    setMatchedCards([]);
    if (start) setStart(false);
    setTimeValue(0);
  } 

  // Hanlder to be called when the card is clicked, after setting/unsetting its visibility
  // The argument to be passed is HTMLElement correspondence of the Card component

  const handleCardClick = (htmlElement: HTMLDivElement) => {
    // Store the max of 2 cards in openedCards array
    if (openedCards.length === 1){
      setOpenedCards((prev) => [...prev, htmlElement])
    }else{
      setOpenedCards([htmlElement])
    }
  }

  // Once the openedCards has 2 cards, evaluate the cards for their values.
  // If matched, push them in matchedCards array
  const evaluateCards = () => {
    if (openedCards[0].dataset.value === openedCards[1].dataset.value){
        openedCards.forEach((card) => {
        card.classList.add("matched");
      })
      setMatchedCards((matchedCards) => matchedCards.concat(openedCards));
    }else{
      // If not matched, flip the cards back after 500ms
      setTimeout(() => {
        openedCards.forEach((card) => card.classList.toggle("visibleState"))
      }, 500);

    }
  }

  // Defined logic in ths hook is called on every "matchedCards" state change
  // So, check if the matchedCards now contains all the desired number of cards
  // and if so, the game is finished..
  // and if so, update the players score.. 
  // and alert the congrats. message
  // and disable the start state, so no more card flipping is possible before re-start
  useEffect(()=>{
    if (matchedCards.length === cardArr.length){
      setStart(false);

      dispatch({type: "UPDATE_SCORE_DB", payload: {last: step, user: userState.currentUser}});
      
      alert("Congratulation, you found the matches in " + step + " steps in " + getFormattedTime(timeValue) + " s");

    }
  }, [matchedCards]);

  // Because the size of the grid is not hard-coded, change the UI grid size (cols, rows count) of the grid container to match the cards number
  useEffect(()=> {
    (document.getElementsByClassName("main-container")[0] as HTMLDivElement).style.gridTemplateColumns = "repeat(" + Math.sqrt(cardArr.length) + ", auto)";
  }, [cardArr.length]);

  // Called every time openCards state changes,
  // so if openCards contains 2 cards, then start evaluating them and increase the step count.
  // Because everytime a player flips two cards, the player takes 1 step more. 
  useEffect(() => {
    if (openedCards.length === 2){
      setStep((step) => step + 1);
      evaluateCards();
    }
  }, [openedCards])

  //Called on every change of start flag.
  // If the game is freshly started,
  // ... start a count-up timer using SetInterval(..) to increase the seconds value
  // If the game is finised, i..e. start = false, then clear the interval which was set to stop timer from running continuously.
  useEffect(() => {
    (document.getElementsByClassName("start")[0] as HTMLInputElement).disabled = start;

    let interval: NodeJS.Timeout;
    if (start){
      interval = setInterval(()=>{
        setTimeValue((timeValue) => timeValue + 1);
      }, 1000);
    }else{
      clearInterval(interval!);
    }

    return () => clearInterval(interval);

  }, [start]);


  return (
    <div className="App">
      <div className="left-screen">
        <div className="main-container">
          <div className="info">
            <div className="stopwatch">Time<span className="stopwatch-value value"> {getFormattedTime(timeValue)} </span></div>
            <div className="steps">Steps<span className="step-value value"> {step} </span></div>          
          </div>
          <div className="controls">
            <div className={(start)? "startWrapper" : "startWrapper start-active"}>
              <button className="start title sub asLink" onClick={startGame}>Start</button>
            </div>
            <button className="reset title sub asLink" onClick={resetGame}>Reset and Reshuffle</button>
          </div>
          {
            // Render <Card> component for each element of cardArr. The Card component takes its position to be the
            // index of cardArr and its value to be the value at that index i.e. cardArr[index]
            // But, as mentioned above, to make matchable pairs,
            //........ we divide the cards into two parts of n-squared / 2 length each. 
            //That is, for "4" in 4 X 4 grid of cards
            // There are two pairs of (4 * 4) / 2 = 16 / 2 = 8 elements in each pair.
            // To make matching values, set the actual value as the remaineder of the value % (n-squared / 2) 
            cardArr.map((card) => {
              return <Card index ={card} value={(card + 1) % (Math.floor(cardArr.length/2))} clickEvent={handleCardClick} disabled={!start}/>;
            })
          }
        </div>
      </div>
      <RightSection/>
    </div>
  );
}

export default App;