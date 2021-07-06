import React, {FC} from "react";
import { User } from "../../state/reducers/userReducer";

// Props for each entry of registered users in Highscore box
// User is one registered user
// you is a flag denoting if the user for this entry is the current (say, looged-in) user 
interface IProps {
    user: User;
    you: boolean;
}

// Tis is one entry of one user in Highscore box
// Dsiplays User name and All Time Score of the player
// along with (YOU) for the currently logged-in user
const Entry: FC<IProps> = (props: IProps) =>{
    return (
        <div className="entry">
            <div className="user-entry-name">{props.user.name} {(props.you)? "(You)" : ""}</div>
            <div className="highscore-container">
                <div className="highscore-entry title sub">All Time Score</div>
                <div className="highscore-entry score">{props.user.score.high} steps only</div>
            </div>
        </div>
    )

}

export default Entry;