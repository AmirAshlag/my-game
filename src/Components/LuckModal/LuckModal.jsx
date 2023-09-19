import { useEffect, useContext, useState } from "react";
import cardsList from "../../Lists/cards-list";
import { myContext } from "../../App";
import Card from "../Card/Card";
import "./LuckModal.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function CardModal() {
  const { cards, setCards, updateScore, setScoreAdded, setScore } =
    useContext(myContext);
  const [givenCard, setGivenCard] = useState("");
  const [takeTreasure, setTakeTreasure] = useState(false);
  const location = useLocation();
  const { turnsleft, box, questionType } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    let myCrads = cards ? [...cards] : [];
    const missingCards = cardsList
      .filter((card) => card.type === box.type)
      .filter((card) => !myCrads.some((myCard) => myCard.id === card.id));
    console.log(missingCards, "missingCards");
    if (!missingCards.length) {
      setGivenCard("no-cards");
    } else if (questionType === "+1") {
      const randomIndex = Math.floor(Math.random() * missingCards.length);
      const selectedCard = missingCards[randomIndex];
      console.log(selectedCard);
      setGivenCard([selectedCard]);
    } else if (questionType === "complete") {
      setGivenCard(missingCards);
    }
    // eslint-disable-next-line
  }, []);

  function exitModal(addCards) {
    if (Array.isArray(givenCard) && addCards) {
      setCards((prev) => {
        return [
          ...givenCard.map((card) => ({ ...card, newCard: true })),
          ...prev,
        ];
      });
      setScoreAdded(givenCard.length);
      setScore((prev) => {
        updateScore(prev + givenCard.length);
        return prev + givenCard.length;
      });
      console.log(turnsleft, "left-challenge");
      setTimeout(() => {
        setCards((prev) => {
          return prev.map((card) => {
            if (card.newCard) {
              return { ...card, newCard: false };
            } else {
              return card;
            }
          });
        });
      }, 1000);
    }
    navigate("/game", {
      state: {
        turnsleft: turnsleft,
      },
    });
  }

  return (
    <div className="modal2">
      <div className="modal-content2">
        {takeTreasure || givenCard === "no-cards" ? (
          <>
            {givenCard && (
              <button
                className="exit-button"
                aria-label="Close"
                onClick={() => {
                  exitModal(true);
                }}
              >
                x
              </button>
            )}
            <div>
              {Array.isArray(givenCard) && (
                <h2 className="luck-title">
                  {givenCard.length > 1
                    ? `You got ${givenCard.length} cards from the ${box.type} collection!`
                    : `You got a card from the ${box.type} collection!`}
                </h2>
              )}
              {givenCard === "no-cards" && (
                <h2 className="luck-title">
                  You have all the cards from {box.type} collection!
                </h2>
              )}
              <div>
                {Array.isArray(givenCard) && (
                  <div
                  className="given-cards"
                  >
                    {givenCard.map((card) => {
                      return (
                        <span key={card.id}>
                          <Card card={card} />
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="question-container">
            {givenCard.length === 1 ? (
              <h3 className="take-treasure-title">
                Would you like to take an extra Card for the {box.type}{" "}
                challenge at the cost of +1 turnes?
              </h3>
            ) : (
              <h3 className="take-treasure-title">
                Would you like to take {givenCard.length} Cards for the{" "}
                {box.type} challenge at the cost of +{givenCard.length} turnes?
              </h3>
            )}
            <div className="buttons-container-luck">
              <button
                onClick={() => {
                  setTakeTreasure(true);
                }}
                className="yes-button"
                // disabled={disableButtons}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  exitModal(false);
                }}
                className="no-button"
                // disabled={disableButtons}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
