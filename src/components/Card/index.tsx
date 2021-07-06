import React, {FC, MouseEvent} from "react";
import "./Card.css";

// Interface resembling properties to the component Card 
interface CardProps {
    value: number; // the value to display at the front of the card, which is to be matched with corresponding card with same value
    index: number; // index number of the card in the grid
    disabled: boolean; // disable flag, inorder to temporarily disable click events when necessary
    clickEvent: (htmlElement: HTMLDivElement) => void; // callback function to call on click event of Card (Callback is passed from App.tsx)
}

/**
 * Card is a Function Component resembling each individual flippable and matchable card in the game.  
 */
const Card: FC<CardProps> = (cardProps: CardProps) => {

    // Handler for click event of the card.
    // Do some disabled-check and flip (using .visibility class to simulate flipping) and fire the callback passed as a prop,
    // so that the logic to carry out on click event is called only for non-disabled card.
    const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
        if (cardProps.disabled) return;
        const element = (event.target as HTMLDivElement).parentElement as HTMLDivElement;
        element!.classList.add("visibleState");
        cardProps.clickEvent(element);
    }

    return (
        <div className="card" data-value={cardProps.value} data-index={cardProps.index} onClick={handleCardClick}>
            {/* Down face of the card which is shown initially. It shows an asterisk character with simple animation*/}
            <div className="card-down _card">
                <span>*</span>
            </div>

            {/* The front face of the card  which shows the value of the card. This value is matched with another card's value */}
            <div className="card-up _card">
                {cardProps.value}
            </div>


        </div>
    )
}

export default Card;