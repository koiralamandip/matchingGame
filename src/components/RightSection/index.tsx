import React, { FC, useState, useEffect, FormEvent, MouseEvent} from "react";
import { useDispatch, useSelector } from "react-redux";
import { InitialState, State} from "../../state/reducers/userReducer";
import HighScoreOverlay from "../HighScoreOverlay/";

/**
 * Functional Component which is the right section of the game screen (page)
 * Contains sections for displying player status, registration form, highscores, and a list of registered users to choose from.
 */
const RightSection: FC = () => {
    
    // State "name" to hold the name of player from registration form during registration
    const [name, setName] = useState("");
    // state to store a flag whether to open/close the highscore box 
    const [isHighscoreOverlay, setHighscoreOverlay] = useState(false);

    // Fetching user data from Redux Store
    const userState : InitialState = useSelector((state: State) => state.userState);
    // Initializing dipatcher for later use 
    const dispatch = useDispatch();
    
    // Dispatch action to Fetch User for the first render of this component.
    // This dispatched action will be caught by Saga midddleware to asynchronously fetch users from json-server before dispatching...
    //.. action to reducer for displaying the fetched users on screen
    useEffect(()=>{
        dispatch({type: "FETCH_USER"})
    }, [])

    // A handler for registration form submission
    const submitHandle = (e: FormEvent) => {
      e.preventDefault(); // Prevent page reload because we don't want that
      // Validation check for empty name
      if (name === ""){
        alert("Can't add user without name")
        return;
      }
      // Dispatch an action of "ADD_USER" which is again caught by Saga to asynchronously add user to json server.. 
      // ... and the recently added user is populated on screen using another dispatch of action "LOAD_USER" from Saga itself.
      // A user with supplied name and default score/gameplay of 0 is passed for insertion.  
      dispatch({type: "ADD_USER", payload: {name: name, score: {high: 0, last: 0}, gameplay: 0}})
    }

    // A handler to set the current player to a selected player from the list
    // You can select among the players listed on right section to play the game as that player.
    // For demonstration purpose, and considering similar games that let you use any name while storing highscore, ..
    // No user-authentication has been implemented. So anyone can play as any player just by selecting the name.
    const handleChangeCurrent = (e: MouseEvent) =>{
      const id = (e.target as HTMLDivElement).dataset.userId;
      // Set current user to the selected user from already fetched list of users. So no async task of calling database is necessary.
      dispatch({type: "SET_CURRENT_USER", payload: userState.users.find(user => user.id === id)})
    }

    // Toggle the flag for opening/closing the HighScore box
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
          <div className="gameplay">
            <span className="title sub">Gameplay</span>
            <span className="data">{userState.currentUser.gameplay} times </span>
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