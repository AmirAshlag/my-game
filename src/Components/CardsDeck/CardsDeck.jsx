import "./CardsDeck.css";
import { myContext } from "../../App";
import { useContext, useEffect } from "react";
import Card from "../Card/Card";

function CardsDeck() {
  const { cards } = useContext(myContext);

  useEffect(() => {
    console.log(cards);
  }, [cards]);

  return (
    <div className="deck">
      {cards &&
        cards
          .sort((a, b) => {
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            return 0;
          })
          .map((card) => {
            return (
              <div className={card.newCard ? "new-card" : ""} key={card.id}>
                <Card card={card} />
              </div>
            );
          })}
    </div>
  );
}

export default CardsDeck;
