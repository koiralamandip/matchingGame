import React, {FC, useState, useEffect, FormEvent} from 'react';
import Card from './components/Card';
import './App.css';
import axios from 'axios';
import RightSection from './components/RightSection';
import { useDispatch, useSelector } from 'react-redux';
import { InitialState, State } from './state/reducers/userReducer';

const shuffleCards = (arrayOfSize: number[]) => {
  // let cardArray = cards();
  for (let i = arrayOfSize.length; i > 0; i--){
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = arrayOfSize[currentIndex];
    arrayOfSize[currentIndex] = arrayOfSize[randomIndex];
    arrayOfSize[randomIndex] = temp;
  }
  return arrayOfSize;
}

const arrayOfSize = (gridLen: number) => {
  return Array.from(Array<number>(gridLen * gridLen).keys());
}

const App: FC = () => {
  let size = 4;
  const [cardArr, setCardArr] = useState(() => {return shuffleCards(arrayOfSize(size));});
  const [timeValue, setTimeValue] = useState(0);  
  const [step, setStep] = useState(0);
  const [start, setStart] = useState(false);
  const [matchedCards, setMatchedCards] = useState<HTMLDivElement[]>([]);
  const [openedCards, setOpenedCards] = useState<HTMLDivElement[]>([]);

  const userState: InitialState = useSelector((state: State) => state).userState;
  const dispatch = useDispatch();

  const startGame = () => {
    if (matchedCards.length === cardArr.length){
      resetGame();
    }
    setStart(true);
  }

  const resetGame = () => {
    matchedCards.forEach((card) => {
      card.classList.remove("matched");
      card.classList.remove("visibleState");

    });

    openedCards.forEach((card) => {
      card.classList.remove("matched");
      card.classList.remove("visibleState");

    });

    setCardArr(shuffleCards(arrayOfSize(4)));
    setStep(0);
    setOpenedCards([]);
    setMatchedCards([]);
    if (start) setStart(false);
    setTimeValue(0);
  } 

  const handleCardClick = (htmlElement: HTMLDivElement, index: number, value: number) => {
    // console.log(event.target);
    if (openedCards.length === 1){
      setOpenedCards((prev) => [...prev, htmlElement])
    }else{
      setOpenedCards([htmlElement])
    }
    // console.log(openedCards);
    // console.log("Shuffled card with original index of " + index + " and set value of " + value);
  }

  const evaluateCards = () => {
    if (openedCards[0].dataset.value === openedCards[1].dataset.value){
      // console.log("Matched!");
      // document.getElementsByClassName("stopwatch")[0].innerHTML = "Matched!!!";
        openedCards.forEach((card) => {
        card.classList.add("matched");
      })
      setMatchedCards((matchedCards) => matchedCards.concat(openedCards));
    }else{
      setTimeout(() => {
        openedCards.forEach((card) => card.classList.toggle("visibleState"))
      }, 500);

    }
  }


  useEffect(()=>{
    if (matchedCards.length === cardArr.length){
      // console.log("OOK finished" + cardArr.length + " and " + matchedCardsCount)
      setStart(false);
      dispatch({type: "UPDATE_SCORE_DB", payload: {last: step, user: userState.currentUser}});
      // dispatch({type: "UPDATE_CURRENT_SCORE", payload: step});
      alert("Congratulation, you found the matches in " + step + " steps in " + getFormattedTime(timeValue) + " s");

    }
  }, [matchedCards]);

  useEffect(()=> {
    (document.getElementsByClassName("main-container")[0] as HTMLDivElement).style.gridTemplateColumns = "repeat(" + Math.sqrt(cardArr.length) + ", auto)";
  }, [cardArr.length]);

  useEffect(() => {
    // console.log(openedCards);
    if (openedCards.length === 2){
      setStep((step) => step + 1);
      evaluateCards();
      // console.log(matchedCardsCount);
    }
  }, [openedCards])

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

  const getFormattedTime = (time: number) => {
    let sec = time % 60;
    let min = Math.floor(time / 60);
    return ((min <= 9)? "0" + min : min ) + ":" + ((sec <= 9)? "0" + sec : sec)
  }

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