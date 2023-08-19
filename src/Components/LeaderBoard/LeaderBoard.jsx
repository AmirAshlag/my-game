import "./LeaderBoard.css";
import { useContext } from "react";
import { myContext } from "../../App";

function Leaderboard() {
  const { usersList, userId } = useContext(myContext);

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
      </div>
      <div className="leaderboard-body">
        {usersList.map(
          (user, index) =>
            (index < 3 || user.userId === userId) && (
              <div className="leaderboard-item" key={index}>
                <p>
                  {index + 1}. {user.userName}
                </p>
                <p>Turnes: {user.score}</p>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
