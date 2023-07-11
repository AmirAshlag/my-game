import "./ChallengeModal.css";
import { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import cardsList from "../../Lists/cards-list";
import Card from "../Card/Card";
import axios from "axios";

function ChallengeModal({ setScore, setScoreAdded, updateScore, score }) {
  const [relevantCards, setRelevantCards] = useState(false);
  const [missingCards, setMissingCards] = useState(false);
  const [answer, setAnswer] = useState(false);
  const [newCards, setNewCards] = useState([]);
  const { cards, setCards, setUsedCards } = useContext(myContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { box, challenge, turnsleft } = location.state;

  useEffect(() => {
    if (cards) {
      console.log(challenge, "challenge");
      console.log(box, "box");

      let freePassIncluded = false;
      const myCards = cards.filter((card) => {
        if (card.type === "Free-Pass") {
          if (freePassIncluded) {
            return false;
          } else {
            freePassIncluded = true;
            return true;
          }
        }
        return card.type === box.type;
      });

      console.log(myCards);
      setRelevantCards(myCards);
      const missingCards = cardsList
        .filter((card) => card.type === box.type)
        .filter((card) => !myCards.some((myCard) => myCard.id === card.id));
      console.log(missingCards, "missingCards");
      setMissingCards(missingCards);
    }
    // eslint-disable-next-line
  }, [cards]);

  useEffect(() => {
    if (challenge) {
      checkAnswer(cards);
    }
    // eslint-disable-next-line
  }, [challenge]);

  function checkAnswer(array) {
    try {
      const rightCard = array.find((card) => {
        return card.text === challenge.challenge.answer;
      });
      if (rightCard) {
        console.log(rightCard, "right card");
        setNewCards((prevCards) =>
          prevCards.filter((card) => card.id !== rightCard.id)
        );
        setAnswer(rightCard);
      }
      if (!rightCard) {
        const freePass = array.find((card) => {
          return card.text === "Free Pass";
        });
        console.log(freePass, "Free Pass");
        setAnswer(freePass);
      }
    } catch (err) {
      console.log(err, "working");
    }
  }

  function exitChallenge() {
    updateScore(score);
    const final = answer;
    const finalCards = [
      ...cards.filter((card) => card.id !== final.id),
      ...newCards,
    ];
    setCards(finalCards);
    axios.post("http://localhost:7070/data/cards", { cards: finalCards });
    setUsedCards((prev) => [...prev, final]);
    console.log(turnsleft, "left-challenge");
    if (challenge.type === "Terminal") {
      navigate("/results");
    } else {
      navigate("/game", {
        state: {
          turnsleft: turnsleft,
        },
      });
    }
  }

  function getRandomCard() {
    setScore((prev) => (prev += 3));
    setScoreAdded((prev) => (prev += 3));
    const randomIndex = Math.floor(Math.random() * missingCards.length);
    const selectedCard = missingCards[randomIndex];
    setMissingCards((prevCards) => {
      return prevCards.filter((card, index) => index !== randomIndex);
    });
    setNewCards((prev) => [...prev, selectedCard]);
    checkAnswer([...relevantCards, { ...selectedCard, added: true }]);
    setRelevantCards((prev) => [...prev, { ...selectedCard, added: true }]);
    setTimeout(() => {
      setRelevantCards((prev) => {
        return prev.map((card) => {
          if (card.added) {
            return { ...card, added: false };
          } else {
            return card;
          }
        });
      });
    }, 1000);
  }

  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        {answer && (
          <button
            className="exit-button"
            aria-label="Close"
            onClick={exitChallenge}
          >
            x
          </button>
        )}
        <div className="modal-top">
          <div className="challenge-text">
            {challenge && challenge.challenge.text}
          </div>
          <button
            className={`take-card-button ${challenge.challenge.type}`}
            onClick={getRandomCard}
            disabled={answer}
          >
            {answer ? "It's a match!" : "Take Card"}
          </button>
        </div>
        <div className="modal-cards">
          {relevantCards &&
            relevantCards.map((card, i) => {
              return (
                <div
                  key={i}
                  className={`${answer?.id === card.id && "card-match"} ${
                    card.added && "added"
                  }`}
                  onClick={()=>{console.log(card.id, answer.id);}}
                >
                  <Card card={card} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default ChallengeModal;
