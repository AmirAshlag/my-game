import "./Entry.css";
import cards from "../../Lists/cards-list.js";
import Card from "../Card/Card";
import { useState, useContext, useEffect } from "react";
import { myContext } from "../../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { nanoid } from "nanoid";

function Entry({ setScore, joinRoom, score, setUserId, gameId, setGameId }) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [cardsAmount, setCardsAmount] = useState(0);
  const [newGameId, setNewGameId] = useState(false);
  // const [gameId, setGameId] = useState("");
  const [userName, setUserName] = useState("");
  const { setCards } = useContext(myContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("refreshed");
  }, []);

  function startGame() {
    const id = nanoid();
    setUserId(id);
    joinRoom({
      roomId: gameId,
      userName: userName,
      userId: id,
      score: score,
      initialCards: selectedCards.length
    });
    axios.post("http://localhost:7070/data/cards", {
      cards: selectedCards,
    });
    navigate("/game", {
      state: {
        turnesleft: false,
      },
    });
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
            max={10}
            min={0}
            type="number"
            id="game-input"
            placeholder="select cards amount 0-10"
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
                getRandomCards(cards, cardsAmount);
              }}
            >
              Go
            </button>
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
          {selectedCards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Entry;
