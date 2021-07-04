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
const HighScoreOverlay : FC<IOverlay> = (props: IOverlay) => {
    
    const overlayRef = useRef(null);
    const userState: InitialState = useSelector((state: State) => state.userState);

    return(
        <div className={(props.visible)? "overlay show" : "overlay"} ref={overlayRef}>
            <div className="highscore">
                <div className="tbar">
                    <div className="title tbar-title">
                        Highscores
                    </div>
                    <button className="asLink title sub" onClick={props.callback}>Close</button>
                </div>
                <div className="users-score-list">
                    <div className="sub">Note: Players with no gameplay aren't listed here</div>
                {
                    sort(userState.users).map((user) => {
                        return (user.score.high >= 8) && <Entry user={user} you={user.id === userState.currentUser.id}/>
                    })
                }
                </div>
                
            </div>
        </div>
    )
}

export default HighScoreOverlay;