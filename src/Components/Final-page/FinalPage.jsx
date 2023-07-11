import React from "react";
import { useContext } from "react";
import { myContext } from "../../App";
import "./FinalPage.css";

function FinalPage() {
  const { usersList } = useContext(myContext);

  const mockData = [
    { gameId: "10001", userName: "User 1", userId: "id1", score: 15 },
    { gameId: "10002", userName: "User 2", userId: "id2", score: 10 },
    { gameId: "10003", userName: "User 3", userId: "id3", score: 20 },
    { gameId: "10004", userName: "User 4", userId: "id4", score: 18 },
    { gameId: "10005", userName: "User 5", userId: "id5", score: 25 },
    { gameId: "10006", userName: "User 6", userId: "id6", score: 17 },
    { gameId: "10007", userName: "User 7", userId: "id7", score: 22 },
    { gameId: "10008", userName: "User 8", userId: "id8", score: 15 },
    { gameId: "10009", userName: "User 9", userId: "id9", score: 19 },
    { gameId: "10010", userName: "User 10", userId: "id10", score: 13 },
    { gameId: "10011", userName: "User 11", userId: "id11", score: 16 },
    { gameId: "10012", userName: "User 12", userId: "id12", score: 20 },
    { gameId: "10013", userName: "User 13", userId: "id13", score: 14 },
    { gameId: "10014", userName: "User 14", userId: "id14", score: 24 },
    { gameId: "10015", userName: "User 15", userId: "id15", score: 12 },
    { gameId: "10016", userName: "User 16", userId: "id16", score: 21 },
    { gameId: "10017", userName: "User 17", userId: "id17", score: 23 },
    { gameId: "10018", userName: "User 18", userId: "id18", score: 18 },
    { gameId: "10019", userName: "User 19", userId: "id19", score: 11 },
    { gameId: "10020", userName: "User 20", userId: "id20", score: 17 },
  ];

  return (
    <div className="final-page-container">
      <div className="full-leaderboard">
        <div className="full-leaderboard-header">
          <h2>Leaderboard</h2>
        </div>
        <div className="full-leaderboard-body">
          {usersList.map((user, index) => (
            <div className="full-leaderboard-item" key={index}>
              <p>
                {index + 1}. {user.userName}
              </p>
              <div className="stats-holder">
                <p>score: {user.score}</p>
                <p>initialCards: {user.initialCards}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FinalPage;
