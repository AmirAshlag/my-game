import "./App.css";
import Board from "./Components/Board/Board";
import Entry from "./Components/Entry-page/Entry";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import ChallengeModal from "./Components/ChallengeModal/ChallengeModal";
import LuckModal from "./Components/LuckModal/LuckModal";
import FinalPage from "./Components/Final-page/FinalPage";
import { io } from "socket.io-client";
// import { useEffect } from "react";

export const myContext = createContext();

export const socket = io("https://goldratt-game23.onrender.com:7070/", {
  transports: ["websocket"],
});

function App() {
  const [cards, setCards] = useState(false);
  const [usedCards, setUsedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [scoreAdded, setScoreAdded] = useState(0);
  const [userId, setUserId] = useState("");
  const [gameId, setGameId] = useState("");
  const [usersList, setUsersList] = useState([]);

  useEffect(()=>{

    return ()=>{
      leaveRoom()
    }
  },[])

  socket.on("connect", () => {
    console.log("connected");
  });

  function joinRoom(data) {
    socket.emit("join-room", data);
  }

  function updateScore(newScore) {
    console.log(gameId);
    socket.emit("update-scoreboard", userId, newScore, gameId);
  }

  function getScoreBoard() {
    socket.emit("get-scoreboard");
  }

  function leaveRoom() {
    socket.emit(
      "leave-room",
      localStorage.getItem("gameId"),
      localStorage.getItem("userId")
    );
  }

  function finishedGamed() {
    socket.emit("finished-game");
  }

  socket.on("scoreboard-updated", (users) => {
    console.log("update-recived");
    users.sort((a, b) => a.score - b.score);
    setUsersList(users);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    window.location.href = "/game";
    leaveRoom();
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
                leaveRoom={leaveRoom}
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
                  finishedGamed={finishedGamed}
                  leaveRoom={leaveRoom}
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
                leaveRoom={leaveRoom}
              />
            }
          />
          <Route
            path="/results"
            element={
              <FinalPage getScoreBoard={getScoreBoard} leaveRoom={leaveRoom} />
            }
          />
        </Routes>
      </BrowserRouter>
    </myContext.Provider>
  );
}

export default App;
