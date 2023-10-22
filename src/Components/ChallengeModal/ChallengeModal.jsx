import "./ChallengeModal.css";
import { useContext, useEffect, useState } from "react";
import { myContext } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cardsList from "../../Lists/cards-list";
import Card from "../Card/Card";
// import axios from "axios";

function ChallengeModal({
  setScore,
  setScoreAdded,
  updateScore,
  score,
  finishedGamed,
  leaveRoom,
}) {
  const [relevantCards, setRelevantCards] = useState(false);
  const [missingCards, setMissingCards] = useState(false);
  const [nextChallengeMissingCards, setNextChallengeMissingCards] = useState(
    []
  );
  const [answer, setAnswer] = useState(false);
  const [showChallenge, setShowChallenge] = useState(true);
  const [showMissingCardsText, setShowMissingCardsText] = useState(false);
  const [newCards, setNewCards] = useState([]);
  const [disableButtons, setDisableButtons] = useState(false);
  const { cards, setCards, setUsedCards } = useContext(myContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { box, challenge, turnsleft } = location.state;

  useEffect(() => {
    if (!cards) {
      leaveRoom();
      navigate("/");
    } else {
      const missingCards = cardsList
        .filter((card) => card.type === box.nextChallengeType)
        .filter((card) => !cards.some((myCard) => myCard.id === card.id));
      setNextChallengeMissingCards(missingCards);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (cards) {
      // console.log(challenge, "challenge");
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
        return card.id === challenge.challenge.answer;
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

  function changeShowChallenge() {
    setShowChallenge((prev) => !prev);
  }

  function takeNextChallengeCard() {
    setDisableButtons(true);
    const randomIndex = Math.floor(
      Math.random() * nextChallengeMissingCards.length
    );
    const selectedCard = nextChallengeMissingCards[randomIndex];
    console.log(selectedCard);
    setRelevantCards([{ ...selectedCard, added: true }]);
    setScore((prev) => (prev += 2));
    setScoreAdded((prev) => (prev += 2));
    setTimeout(() => {
      exitChallenge({ ...selectedCard, newCard: true });
    }, 1800);
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
    }, 2800);
  }

  useEffect(() => {
    console.log(answer, "answer");
  }, [answer]);

  function exitChallenge(card) {
    console.log(card);
    if (card) {
      updateScore(score + 2);
    } else {
      updateScore(score)
    }
    let finalCards = [
      ...cards.filter((card) => card.id !== answer.id),
      ...newCards,
    ];
    if (card) {
      finalCards = [...finalCards, card];
    }
    console.log(finalCards);
    setCards(finalCards);
    setUsedCards((prev) => [...prev, answer]);
    // console.log(turnsleft, "left-challenge");
    if (challenge.type === "Terminal") {
      finishedGamed();
      navigate("/results/leaderBoard");
    } else {
      // change back to turnsleft to make it work
      navigate("/game", {
        state: {
          turnsleft: 0,
        },
      });
    }
  }

  function getRandomCard() {
    setShowMissingCardsText(true);
    setTimeout(() => {
      setShowMissingCardsText(false);
    }, 300);

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
        {showChallenge ? (
          <div className="modal-top">
            <div className="challenge-text">
              {challenge ? challenge.challenge.text : null}
            </div>
            <button
              className={`take-card-button ${
                challenge ? challenge.challenge.type : ""
              }`}
              onClick={getRandomCard}
              disabled={answer}
            >
              {answer ? "It's a match!" : "Take Card"}
            </button>
            {!answer && (
              <div
                className={`no-cards ${
                  showMissingCardsText ? "fade-in-out" : ""
                }`}
              >
                there is no matching full kit card
              </div>
            )}
            {answer && (
              <FontAwesomeIcon
                icon={faPersonWalkingArrowRight}
                className="arrow-exit"
                onClick={
                  box.nextChallengeType && nextChallengeMissingCards.length
                    ? () => changeShowChallenge()
                    : () => exitChallenge(false)
                }
              />
            )}
          </div>
        ) : (
          <div className="modal-top2">
            <h3 className="take-card-title">
              Would you like to take an extra Card for the{" "}
              {box.nextChallengeType} challenge at the cost of +2 turnes?
            </h3>
            <div className="take-card-button-container">
              <button
                onClick={takeNextChallengeCard}
                className="yes-button"
                disabled={disableButtons}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  exitChallenge(false);
                }}
                className="no-button"
                disabled={disableButtons}
              >
                No
              </button>
            </div>
          </div>
        )}
        <div className="modal-cards">
          {relevantCards &&
            relevantCards.map((card, i) => (
              <div
                key={i}
                className={`${
                  answer && answer.id === card.id ? "card-match" : ""
                } ${card.added ? "glow" : ""}`}
              >
                <Card card={card} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ChallengeModal;
