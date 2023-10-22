import React, { useEffect } from "react";
import { useContext } from "react";
import { myContext } from "../../App";
import "./FinalPage.css";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

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
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>Game results</h1>
        </div>
        <ul className="navbar-menu">
          <li>
            <Link to="/results/leaderBoard">Leaderboard</Link>
          </li>
          <li>
            <Link to="/results/statistics">Statistics</Link>
          </li>
          <li>
            <Link to="/">Exit</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default FinalPage;
