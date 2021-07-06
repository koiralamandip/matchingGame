import React, {FC, useRef} from "react";
import { useSelector } from "react-redux";
import Entry from "./Entry";
import { InitialState, State } from "../../state/reducers/userReducer";
import "./styles.css";
import { sort } from "../functions";

interface IOverlay{
    visible: boolean;
    callback: () => void;
}

// Functional Component for the Highscore box which is an overlay <div> 
const HighScoreOverlay : FC<IOverlay> = (props: IOverlay) => {
    
    // referencing the top level overlay div,  for closing when neeed
    const overlayRef = useRef(null);
    
    // Fetching the user state from Redux Store which contains the information about registered users/players
    const userState: InitialState = useSelector((state: State) => state.userState);

    return(
        <div className={(props.visible)? "overlay show" : "overlay"} ref={overlayRef}>
            <div className="highscore">
                <div className="tbar">
                    <div className="title tbar-title">
                        Highscores
                    </div>
                    {/* onClick event fires a callback which is passed from RightSection.tsx because the open/close state of the overlay is 
                    stored there. The project uses component-based state for runtime states and Redux state to store complex/server-fetchable data for now*/}
                    <button className="asLink title sub" onClick={props.callback}>Close</button>
                </div>
                <div className="users-score-list">
                    <div className="sub">Note: Players with no gameplay aren't listed here</div>
                {
                    // For each user who has played at least once, pass their state for entry in Highscore section.
                    //Sorting is done to display the top scorers first (in Descending order of their highscore).
                    sort(userState.users).map((user) => {
                        return (user.gameplay > 0) && <Entry user={user} you={user.id === userState.currentUser.id}/>
                    })
                }
                </div>
                
            </div>
        </div>
    )
}

export default HighScoreOverlay;