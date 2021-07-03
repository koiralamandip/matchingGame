import React, { FC, useState, useEffect, FormEvent, MouseEvent} from "react";
import { useDispatch, useSelector } from "react-redux";
import { InitialState, State} from "../../state/reducers/userReducer";
import HighScoreOverlay from "../HighScoreOverlay/";

const RightSection: FC = () => {
    
    const [name, setName] = useState("");
    const [isHighscoreOverlay, setHighscoreOverlay] = useState(false);

    const userState : InitialState = useSelector((state: State) => state.userState);
    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch({type: "FETCH_USER"})
    }, [])

    const submitHandle = (e: FormEvent) => {
      e.preventDefault();
      if (name === ""){
        alert("Can't add user without name")
        return;
      }
      dispatch({type: "ADD_USER", payload: {name: name, score: {high: 0, last: 0}}})
    }

    const handleChangeCurrent = (e: MouseEvent) =>{
      const id = (e.target as HTMLDivElement).dataset.userId;
        // console.log(userState.users.find(user => user.id === id))
      dispatch({type: "SET_CURRENT_USER", payload: userState.users.find(user => user.id === id)})
    }

    const handleHighScoreVisibility = () => {
      setHighscoreOverlay(!isHighscoreOverlay);
    }


    return (
      <div className="right-screen">
        <HighScoreOverlay visible={isHighscoreOverlay} callback={handleHighScoreVisibility}/>
        <div className="current-user-section">
          <div className="title">
            Currently playing as:
          </div>
          <div className="user-name">
            {userState.currentUser.name}
          </div>
          <div className="all-time">
            <span className="title sub">All Time Score</span>
            <span className="data">{userState.currentUser.score.high} steps {(userState.currentUser.score.high === 8)? "(TOP)" : ""}</span>
          </div>
          <div className="last-time">
            <span className="title sub">On Last Session</span>
            <span className="data">{userState.currentUser.score.last} steps {(userState.currentUser.score.last === 8)? "(TOP)" : ""}</span>
          </div>
        </div>
        <div className="register-form-section">
          <span className="title sub asLink" onClick={handleHighScoreVisibility}>Highscores</span>
          <div className="title">Register as New</div>
          <form className="title" method="post" onSubmit={submitHandle}>
            <input type="text" name="name" placeholder="Username" onChange={(e) => setName(e.target.value)}/>
            <button type="submit" className="title asLink sub">Register</button>
          </form> 
        </div>
        <div className="other-section">
          <div className="title sub">Or, Play as an existing User</div>
          <div className="user-list">
            {
              Array.from(userState.users).map((user) => (<div className="a sub" data-user-id={user.id} onClick={handleChangeCurrent}>{user.name}</div>))
            }              
          </div>
        </div>
      </div>
    )
}

export default RightSection;