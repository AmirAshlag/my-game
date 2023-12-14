import React, { useEffect } from "react";
import { useContext } from "react";
import { myContext } from "../../../App";
import "../FinalPage.css";

function FinalLeaderBoard() {
  const { usersList, isAdmin, userId, RemovePlayer } = useContext(myContext);

  return (
    <div className="full-leaderboard">
      <div className="full-leaderboard-header">
        <h2>Leaderboard</h2>
      </div>
      <div className="game-averages">
        <span className="Game-numbers-title">Game-numbers</span>
        <span>
          Players: {usersList.filter((user) => user.finished === true).length}
        </span>
        <span>
          Average cards taken:{" "}
          {(
            usersList
              .filter((user) => user.finished === true)
              .reduce((accumulator, player) => {
                return accumulator + player.initialCards;
              }, 0) / usersList.filter((user) => user.finished === true).length
          ).toFixed(2)}
        </span>
        <span>
          Average score:{" "}
          {(
            usersList
              .filter((user) => user.finished === true)
              .reduce((accumulator, player) => {
                return accumulator + player.score;
              }, 0) / usersList.filter((user) => user.finished === true).length
          ).toFixed(2)}
        </span>
        <span>
          Didn't exceed 30:{" "}
          {
            (
              (usersList.filter(
                (user) => user.finished === true && user.score < 31
              ).length /
                Math.max(
                  1,
                  usersList.filter((user) => user.finished === true).length
                )) *
              100
            )
              .toString()
              .match(/^-?\d+(?:\.\d{0,2})?/)[0]
          }
          %
        </span>
      </div>
      <div className="full-leaderboard-body">
        {usersList
          .filter((user) => {
            return user.finished === true;
          })
          .map((user, index) => (
            <div className="full-leaderboard-item" key={index}>
              <div className="userListRow">
                <div className="userListRowLeft">
                  <p>
                    {index + 1}. {user.userName}
                  </p>
                  <div className="stats-holder">
                    <p>Time score: {user.score}</p>
                    <p>Initial-cards: {user.initialCards}</p>
                    <p>Chests-landed: {user.chestsLanded}</p>
                  </div>
                </div>
                {isAdmin && userId !== user.userId && (
                  <button className="removePlayerButton" onClick={()=>{
                    RemovePlayer(user.roomId, user.userId);
                  }}>
                    Remove {user.userName}
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default FinalLeaderBoard;
