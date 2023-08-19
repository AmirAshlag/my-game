import "./Entry.css";
import cards from "../../Lists/cards-list.js";
import Card from "../Card/Card";
import { useState, useContext, useEffect } from "react";
import { myContext } from "../../App";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { nanoid } from "nanoid";

function Entry({
  setScore,
  joinRoom,
  score,
  setUserId,
  gameId,
  setGameId,
  leaveRoom,
}) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [cardsAmount, setCardsAmount] = useState("");
  const [cardsError, setCardsError] = useState(false);
  const [newGameId, setNewGameId] = useState(false);
  const [userName, setUserName] = useState("");
  const { setCards } = useContext(myContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("refreshed");
    leaveRoom();
    // eslint-disable-next-line
  }, []);

  function startGame() {
    if (cardsAmount > 0 && cardsAmount < 16) {
      const id = nanoid();
      setUserId(id);
      joinRoom({
        roomId: gameId,
        userName: userName,
        userId: id,
        score: score,
        initialCards: selectedCards.length,
        finished: false,
      });
      localStorage.setItem("gameId", gameId);
      localStorage.setItem("userId", id);
      navigate("/game", {
        state: {
          turnsleft: false,
        },
      });
    } else {
      setCardsError(true);
    }
  }

  function getRandomCards(arr, n) {
    console.log(n);
    if (n === 0) {
      setCards([]);
      setSelectedCards([]);
      setScore(0);
    } else if (n > 0) {
      let result = new Array(n),
        len = arr.length,
        taken = new Array(len);

      if (n > len)
        throw new RangeError(
          "getRandomCards: more elements taken than available"
        );

      while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
      }

      console.log(result);
      setCards(result);
      setSelectedCards(result);
      setScore(result.length);
    }
  }

  return (
    <div>
      <div className="entry-container">
        <button
          className="create-btn"
          onClick={() => {
            const id = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            setNewGameId(id);
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
            max={15}
            min={1}
            type="number"
            id="game-input"
            placeholder="select cards amount 1-15"
            disabled={selectedCards.length}
            onChange={(e) => {
              setCardsAmount(e.target.value);
            }}
            value={cardsAmount}
          />
          {selectedCards.length ? (
            <button
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
                if (cardsAmount > 0 && cardsAmount < 16) {
                  setCardsError(false);
                  getRandomCards(cards, cardsAmount);
                } else {
                  setCardsError(true);
                }
              }}
            >
              Go
            </button>
          )}
        </div>
        {cardsError && (
          <div className="error-message">
            please select 1-15 cards and click on Go
          </div>
        )}
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
          {selectedCards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Entry;
