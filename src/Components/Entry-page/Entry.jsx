import "./Entry.css";
import cards from "../../Lists/cards-list.js";
import Card from "../Card/Card";
import { useState, useContext, useEffect } from "react";
import { myContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

function Entry({
  setScore,
  joinRoom,
  score,
  setUserId,
  gameId,
  setGameId,
  leaveRoom,
  getNewRoomId,
  newGameId,
  setIsAdmin,
}) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [cardsAmount, setCardsAmount] = useState("");
  const [teamNumber, setTeamNumber] = useState(false);
  const [cardsError, setCardsError] = useState(false);
  const [teamError, setTeamError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [idError, setIdError] = useState(false);
  const [userName, setUserName] = useState("");
  const { setCards, cards: userCards } = useContext(myContext);
  const navigate = useNavigate();

  useEffect(() => {
    setTeamNumber(false)
    setCards([]);
    leaveRoom();
    // eslint-disable-next-line
  }, []);

  function startGame() {
    if (
      gameId.length === 5 &&
      userName &&
      userCards.length > 0 &&
      userCards.length < 21 &&
      teamNumber > 0 &&
      teamNumber < 31
    ) {
      const id = nanoid();
      setUserId(id);
      joinRoom({
        roomId: gameId,
        userName: userName,
        userId: id,
        score: score,
        initialCards: selectedCards.length,
        finished: false,
        chestsLanded: 0,
        teamNumber: teamNumber,
      });
      localStorage.setItem("gameId", gameId);
      localStorage.setItem("userId", id);
      if (gameId === newGameId) {
        setIsAdmin(true);
      }
      navigate("/game", {
        state: {
          turnsleft: false,
        },
      });
    } else {
      if (gameId.length !== 5) {
        setIdError(true);
      } else if (idError) {
        setIdError(false);
      }
      if (!userName) {
        setNameError(true);
      } else if (nameError) {
        setNameError(false);
      }
      if (userCards.length < 1 || userCards.length > 15 || !userCards) {
        setCardsError(true);
      } else if (cardsError) {
        setCardsError(false);
      }
       if (teamNumber < 1 || teamNumber > 30 || !teamNumber) {
         setTeamError(true);
       } else if (cardsError) {
         setTeamError(false);
       }
    }
  }

  function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function distributeCards(num) {
    const types = Array.from(new Set(cards.map((card) => card.type)));
    let output = [];

    // Create a deep copy of the cards array to manipulate without affecting the original
    let cardsCopy = JSON.parse(JSON.stringify(cards));
    for (let index = 0; index < num; index++) {
      const randomNumber = getRandomNumberInRange(1, 21 - index);
      if (randomNumber === 1) {
        output.push({ type: "Free-Pass", id: "F1", text: "Free Pass" });
        num -= 1;
        break;
      }
    }
    const baseCount = Math.floor(num / types.length);
    const extraCount = num % types.length;

    for (const type of types) {
      let cardsOfType = cardsCopy.filter((card) => card.type === type);

      if (cardsOfType.length < baseCount) {
        // Handle error: Not enough unique cards of this type to distribute
        console.error(`Not enough unique cards of type ${type} to distribute`);
        return;
      }

      for (let i = 0; i < baseCount; i++) {
        const randomIndex = Math.floor(Math.random() * cardsOfType.length);
        const chosenCard = cardsOfType.splice(randomIndex, 1)[0];
        output.push(chosenCard);

        // Remove the chosen card from cardsCopy
        const cardCopyIndex = cardsCopy.indexOf(chosenCard);
        cardsCopy.splice(cardCopyIndex, 1);
      }
    }

    // Shuffle the types array
    const shuffledTypes = [...types].sort(() => Math.random() - 0.5);

    for (let i = 0; i < extraCount; i++) {
      const extraType = shuffledTypes[i];
      let extraCards = cardsCopy.filter((card) => card.type === extraType);

      if (extraCards.length === 0) {
        // Handle error: No unique cards of this type left to distribute
        console.error(
          `No unique cards of type ${extraType} left to distribute`
        );
        return;
      }

      const randomIndex = Math.floor(Math.random() * extraCards.length);
      const chosenCard = extraCards.splice(randomIndex, 1)[0];
      output.push(chosenCard);

      // Remove the chosen card from cardsCopy
      const cardCopyIndex = cardsCopy.indexOf(chosenCard);
      cardsCopy.splice(cardCopyIndex, 1);
    }

    setCards(output);
    setSelectedCards(output);
    setScore(output.length);
  }

  return (
    <div className="form-container">
      <div className="entry-container">
        <button
          className="create-btn"
          onClick={() => {
            getNewRoomId();
          }}
        >
          Create new game
        </button>
        {newGameId && <div className="game-id">game id: {newGameId}</div>}
        <div className="input-group">
          <input
            type="text"
            id="name-input"
            placeholder=" Enter name:"
            className="input2"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            value={userName}
            maxLength="14"
          />
        </div>
        <div className="input-group">
          <input
            type="number"
            id="game-input"
            placeholder=" Enter game Id:"
            className="input2"
            onChange={(e) => {
              setGameId(e.target.value);
            }}
            value={gameId}
          />
        </div>
        <div className="input-group">
          <input
            max={30}
            min={1}
            type="number"
            id="team-input"
            placeholder=" Enter team number:"
            className="input2"
            onChange={(e) => {
              setTeamNumber(e.target.value);
            }}
            value={teamNumber}
          />
        </div>
        <div className="input-group">
          <input
            max={20}
            min={1}
            type="number"
            id="number-input"
            placeholder="select cards amount"
            disabled={selectedCards.length}
            onChange={(e) => {
              setCardsAmount(e.target.value);
            }}
            value={cardsAmount}
          />
          {selectedCards.length ? (
            <button
              disabled
              className="submit-btn"
              onClick={() => {
                setSelectedCards([]);
                setCards(false);
              }}
            >
              X
            </button>
          ) : (
            <button
              className="submit-btn"
              onClick={() => {
                if (cardsAmount > 0 && cardsAmount < 21) {
                  setCardsError(false);
                  distributeCards(cardsAmount);
                } else {
                  setCardsError(true);
                }
              }}
            >
              Go
            </button>
          )}
        </div>
        <div className="error-container">
          {cardsError && (
            <div className="error-message">
              Please select 1-20 cards and click on Go
            </div>
          )}
          {idError && (
            <div className="error-message">Please enter valid game id</div>
          )}
          {nameError && (
            <div className="error-message">please enter your name</div>
          )}
          {teamError && (
            <div className="error-message">please enter valid team number</div>
          )}
        </div>
        <button
          className="start-btn"
          onClick={() => {
            startGame();
          }}
        >
          Start
        </button>
      </div>

      {selectedCards.length > 0 && (
        <div className="ticker">
          {selectedCards
            .sort((a, b) => {
              if (a.type < b.type) return -1;
              if (a.type > b.type) return 1;
              return 0;
            })
            .map((card) => {
              return <Card card={card} key={card.id} />;
            })}
        </div>
      )}
    </div>
  );
}

export default Entry;
