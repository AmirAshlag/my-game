import { useEffect, useMemo } from "react";
import "./Board.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Dice from "../Dice/Dice";
import myArray from "../../Lists/board-list.js";
import Checkpoint from "../SpecialSpots/Checkpoint";
import Question from "../SpecialSpots/Question";
import CardsDeck from "../CardsDeck/CardsDeck";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import challengesList from "../../Lists/challenges";
import Leaderboard from "../LeaderBoard/LeaderBoard";

// const waitTime = async (time = 500) =>
//   new Promise((resolve) => setTimeout(() => resolve(), time));

function Board({ score, setScoreAdded, scoreAdded, setScore, updateScore }) {
  const [userLocation, setUserLocation] = useState(0);
  const [challenges, setChallenges] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [disabledDice, setDisabledDice] = useState(false);
  const [scoreAddedByRoll, setScoreAddedByRooll] = useState(0);
  const verticalIndexes = [9, 19, 20, 30];
  const backwardsIndexs = [29, 28, 27, 26, 25, 24, 23, 22, 21];
  const checkpoints = [5, 22, 29, 42, 49];
  const questionMarks = [9, 25, 30];
  const location = useLocation();
  const { turnsleft } = location.state;

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("refreshed")) {
      navigate("/");
    } else {
      localStorage.setItem("refreshed", true);
    }

    return () => {
      localStorage.removeItem("refreshed");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log(turnsleft, "turns left");
    if (location.pathname === "/game") {
      setTimeout(() => {
        setScoreAdded(0);
      }, 3000);
      console.log("working");
      if (turnsleft === 0) {
        setDisabledDice(false);
      } else if (turnsleft) {
        setDisabledDice(true);
        setTimeout(() => {
          MoveUser(turnsleft, true);
        }, 500);
      }
    }
    // eslint-disable-next-line
  }, [location]);

  function assignChallenges(myArray, cards) {
    let checkpointObjects = myArray.filter(
      (item) => typeof item === "object" && item.checkpoint === true
    );
    checkpointObjects = checkpointObjects.map((checkpointObject) => {
      const relevantCards = cards.filter(
        (card) =>
          card.type === checkpointObject.type && card.text !== "Free Pass"
      );
      if (relevantCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * relevantCards.length);
        checkpointObject.challenge = relevantCards[randomIndex];
      }

      return checkpointObject;
    });
    // console.log(checkpointObjects);
    setChallenges(checkpointObjects);
    return checkpointObjects;
  }

  useEffect(() => {
    assignChallenges(myArray, challengesList);
    setLoaded(true);
  }, []);

  function checkIfChallenge(i, interval, turnsleftholder, timeout) {
    if (checkpoints.includes(i + userLocation)) {
      const challengeIndex = userLocation + i;
      const currentBox = myArray.slice(challengeIndex, challengeIndex + 1)[0];
      const challenge = challenges.find((item) => {
        return item.type === currentBox.type;
      });
      navigate("/game/challenge", {
        state: {
          box: currentBox,
          challenge: challenge,
          turnsleft: turnsleftholder,
        },
      });
      clearTimeout(timeout);
      clearInterval(interval);
    } else if (
      questionMarks.includes(i + userLocation) &&
      turnsleftholder === 0
    ) {
      clearTimeout(timeout);
      clearInterval(interval);
      navigate("/game/luck", {
        state: {
          turnsleft: turnsleftholder,
        },
      });
    }
  }

  async function MoveUser(number, continuedTurn) {
    console.log("moved");
    if (!continuedTurn) {
      updateScore(score + 1);
      setScore((prev) => (prev += 1));
      setScoreAddedByRooll(1);
      setTimeout(() => {
        setScoreAddedByRooll(0);
      }, 1000);
    }
    let i = 0;
    let turnsleftholder = number;
    const interval = setInterval(() => {
      console.log(i + userLocation);
      if (userLocation + i === 49) {
        return clearInterval(interval);
      } else if (verticalIndexes.includes(userLocation + i)) {
        setUserLocation((prev) => (prev += 10));
        i += 10;
        turnsleftholder--;
        checkIfChallenge(i, interval, turnsleftholder, timeout);
      } else if (backwardsIndexs.includes(userLocation + i)) {
        setUserLocation((prev) => (prev -= 1));
        i--;
        turnsleftholder--;
        checkIfChallenge(i, interval, turnsleftholder, timeout);
      } else {
        setUserLocation((prev) => (prev += 1));
        i++;
        turnsleftholder--;
        checkIfChallenge(i, interval, turnsleftholder, timeout);
      }
    }, 500);

    // for (let i = 0; i < turnsleftholder; i++) {
    //   // do your thing
    //   await waitTime();
    // }
    const timeout = setTimeout(() => {
      setDisabledDice(false);
      clearInterval(interval);
    }, number * 500);
  }

  // const isDisabled = useMemo(() => {
  //   if (blabla) return true;
  //   return false;
  // }, []);

  return (
    <div className="board-body">
      <div className="center-board">
        <Leaderboard />
        <div className="board-container">
          <div className="top-container">
            {location.pathname === "/game" && (
              <h2>
                Score: {score}{" "}
                {scoreAdded !== 0 && scoreAddedByRoll === 0 && (
                  <span className="fade-out">+({scoreAdded})</span>
                )}
                {scoreAddedByRoll !== 0 && (
                  <span className="fade-out">+({scoreAddedByRoll})</span>
                )}
              </h2>
            )}
            {location.pathname !== "/game" && <div></div>}
            <Dice
              loaded={loaded}
              MoveUser={MoveUser}
              disabledDice={disabledDice}
              setDisabledDice={setDisabledDice}
            />
            {/* <Leaderboard/> */}
            <div></div>
          </div>
          <div className="board">
            {myArray.map((box, i) => {
              return typeof box === "object" ? (
                box.checkpoint ? (
                  <Checkpoint
                    box={box}
                    userLocation={userLocation}
                    i={i}
                    key={i}
                  />
                ) : (
                  <Question
                    box={box}
                    userLocation={userLocation}
                    i={i}
                    key={i}
                  />
                )
              ) : (
                <div className={box ? "box" : "empty"} key={i}>
                  {userLocation === i && (
                    <FontAwesomeIcon icon={faUser} className="user" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="placeholder"></div>
      </div>
      <CardsDeck />
      <Outlet />
    </div>
  );
}

export default Board;
