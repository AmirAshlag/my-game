import "./App.css";
import Board from "./Components/Board/Board";
import Entry from "./Components/Entry-page/Entry";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext, useState } from "react";
import ChallengeModal from "./Components/ChallengeModal/ChallengeModal";
import LuckModal from "./Components/LuckModal/LuckModal";
import FinalPage from "./Components/Final-page/FinalPage";
import { io } from "socket.io-client";

export const myContext = createContext();

function App() {
  const [cards, setCards] = useState(false);
  const [usedCards, setUsedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [scoreAdded, setScoreAdded] = useState(0);
  const [userId, setUserId] = useState("");
  const [gameId, setGameId] = useState("");
  const [usersList, setUsersList] = useState([]);

  const socket = io("http://localhost:3000/");
  socket.on("connect", () => {
    console.log("connected");
  });

  function joinRoom(data) {
    socket.emit("join-room", data);
  }

  function updateScore(newScore) {
    console.log("updating");
    socket.emit("update-scoreboard", userId, newScore, gameId);
  }

  socket.on("scoreboard-updated", (users) => {
    users.sort((a, b) => a.score - b.score);
    console.log("called");
    console.log(users, "users");
    setUsersList(users);
  });

  return (
    <myContext.Provider
      value={{ cards, setCards, setUsedCards, usedCards, usersList, userId }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/game"
            element={
              <Board
                setCards={setCards}
                score={score}
                setScoreAdded={setScoreAdded}
                scoreAdded={scoreAdded}
                setScore={setScore}
                updateScore={updateScore}
              />
            }
          >
            <Route
              path="challenge"
              element={
                <ChallengeModal
                  setScore={setScore}
                  setScoreAdded={setScoreAdded}
                  updateScore={updateScore}
                  scoreAdded={scoreAdded}
                  score={score}
                />
              }
            />
            <Route path="luck" element={<LuckModal />} />
          </Route>
          <Route
            path="/"
            element={
              <Entry
                setScore={setScore}
                joinRoom={joinRoom}
                score={score}
                setUserId={setUserId}
                setGameId={setGameId}
                gameId={gameId}
              />
            }
          />
          <Route path="/results" element={<FinalPage />} />
        </Routes>
      </BrowserRouter>
    </myContext.Provider>
  );
}

export default App;
