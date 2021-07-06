import React, {FC, MouseEvent} from "react";
import "./Card.css";

// Interface resembling properties to the component Card 
interface CardProps {
    value: number; // the value to display at the front of the card, which is to be matched with corresponding card with same value
    index: number; // index number of the card in the grid
    disabled: boolean; // disable flag, inorder to temporarily disable click events when necessary
    clickEvent: (htmlElement: HTMLDivElement, index: number, value: number) => void; // callback function to call on click event
}

const Card: FC<CardProps> = (cardProps: CardProps) => {


    const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
        if (cardProps.disabled) return;
        const element = (event.target as HTMLDivElement).parentElement as HTMLDivElement;
        element!.classList.add("visibleState");
        cardProps.clickEvent(element, cardProps.index, cardProps.value);
    }

    return (
        <div className="card" data-value={cardProps.value} data-index={cardProps.index} onClick={handleCardClick}>
            <div className="card-down _card">
                <span>*</span>
            </div>

            <div className="card-up _card">
                {cardProps.value}
            </div>


        </div>
    )
}

export default Card;