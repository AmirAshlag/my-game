import { useEffect, useContext, useState } from "react";
import cardsList from "../../Lists/cards-list";
import { myContext } from "../../App";
import Card from "../Card/Card";
import "./LuckModal.css";
import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

export default function CardModal({ card }) {
  const { cards, setCards, usedCards } = useContext(myContext);
  const [givenCard, setGivenCard] = useState("");
  const location = useLocation();
  const { turnsleft } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    try {
      let myCrads = cards ? [...cards] : [];
      console.log(usedCards, "used");
      if (usedCards) {
        myCrads = [...myCrads, ...usedCards];
      }

      const filterdList = cardsList.filter(
        (cardList) => !myCrads.some((card) => card.id === cardList.id)
      );
      const randomIndex = Math.floor(Math.random() * filterdList.length);
      const selectedCard = filterdList[randomIndex];
      console.log(filterdList);
      console.log(selectedCard);
      setGivenCard(selectedCard);
    } catch (error) {
      console.error("An error occurred:", error);
    }
    // eslint-disable-next-line
  }, []);

  function exitModal() {
    setCards((prev) => [{ ...givenCard, newCard: true }, ...prev]);
    // axios.post("http://localhost:7070/data/cards", {
    //   cards: [...cards, givenCard],
    // });
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
    navigate("/game", {
      state: {
        turnsleft: turnsleft,
      },
    });
  }

  return (
    <div className="modal2">
      <div className="modal-content2">
        {givenCard && (
          <button
            className="exit-button"
            aria-label="Close"
            onClick={exitModal}
          >
            x
          </button>
        )}
        {givenCard && (
          <h2 className="luck-title">
            you got a card from the {givenCard.type} collection!
          </h2>
        )}
        <div>{givenCard && <Card card={givenCard} />}</div>
      </div>
    </div>
  );
}
