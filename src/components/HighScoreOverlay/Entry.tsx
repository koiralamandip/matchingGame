import React, {FC} from "react";
import { User } from "../../state/reducers/userReducer";

interface IProps {
    user: User;
    you: boolean;
}

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