import React, {FC, MouseEvent} from "react";
import "./Card.css";

interface CardProps {
    value: number;
    index: number;
    disabled: boolean;
    clickEvent: (htmlElement: HTMLDivElement, index: number, value: number) => void;
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
                {cardProps.value}
            </div>

            <div className="card-up _card">
                <span>*</span>
            </div>


        </div>
    )
}

export default Card;