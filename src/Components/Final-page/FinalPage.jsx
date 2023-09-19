import React, { useEffect } from "react";
import { useContext } from "react";
import { myContext } from "../../App";
import "./FinalPage.css";
import { useNavigate } from "react-router-dom";

function FinalPage({ getScoreBoard, leaveRoom }) {
  const { usersList } = useContext(myContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usersList.length) {
      leaveRoom();
      navigate("/");
    }
    getScoreBoard();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="final-page-container">
      <div className="full-leaderboard">
        <div className="full-leaderboard-header">
          <h2>Leaderboard</h2>
        </div>
        <div className="full-leaderboard-body">
          {usersList
            .filter((user) => {
              return user.finished === true;
            })
            .map((user, index) => (
              <div className="full-leaderboard-item" key={index}>
                <p>
                  {index + 1}. {user.userName}
                </p>
                <div className="stats-holder">
                  <p>Turnes: {user.score}</p>
                  <p>Initial-cards: {user.initialCards}</p>
                  <p>Chests-landed: {user.chestsLanded}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default FinalPage;
