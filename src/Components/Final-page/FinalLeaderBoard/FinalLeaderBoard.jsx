import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { myContext } from "../../../App";
import "../FinalPage.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";

function FinalLeaderBoard() {
  const { usersList, isAdmin, userId, RemovePlayer } = useContext(myContext);
  const [groupedByTeam, setGroupedByTeam] = useState(false);
  const [open, setOpen] = useState({});

  const handleClick = (teamNumber) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [teamNumber]: !prevOpen[teamNumber],
    }));
  };

  useEffect(() => {
    const teamsList = usersList
      .filter((user) => user.finished === true)
      .reduce((accumulator, user) => {
        // If the teamNumber doesn't exist in the accumulator, initialize it
        if (!accumulator[user.teamNumber]) {
          accumulator[user.teamNumber] = [];
        }
        // Add the user to the appropriate team
        accumulator[user.teamNumber].push(user);

        return accumulator;
      }, {});

    setGroupedByTeam(teamsList);
  }, [usersList]);

  useEffect(() => {
    console.log(groupedByTeam);
  }, [groupedByTeam]);

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
          Average turns:{" "}
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
        {groupedByTeam &&
          Object.entries(groupedByTeam)
            .sort((a, b) => {
              // Sort teams first by average score, then by whether all members scored under 31
              const avgScoreA =
                a[1].reduce((sum, user) => sum + user.score, 0) / a[1].length;
              const avgScoreB =
                b[1].reduce((sum, user) => sum + user.score, 0) / b[1].length;
              if (avgScoreA !== avgScoreB) {
                return avgScoreA - avgScoreB;
              }
              const allUnder31A = a[1].every((user) => user.score < 31);
              const allUnder31B = b[1].every((user) => user.score < 31);
              return allUnder31B - allUnder31A;
            })
            .map(([teamNumber, teamMembers]) => (
              <React.Fragment key={teamNumber}>
                <ListItem>
                  <ListItemButton onClick={() => handleClick(teamNumber)}>
                    <ListItemIcon>
                      {open[teamNumber] ? (
                        <ArrowDropDownIcon />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <div className="team-averages">
                          <span>Team {teamNumber}</span>
                          <span>Players: {teamMembers.length}</span>
                          <span>
                            Average cards taken:{" "}
                            {(
                              teamMembers.reduce(
                                (accumulator, player) =>
                                  accumulator + player.initialCards,
                                0
                              ) / teamMembers.length
                            ).toFixed(2)}
                          </span>
                          <span>
                            Average turns:{" "}
                            {(
                              teamMembers.reduce(
                                (accumulator, player) =>
                                  accumulator + player.score,
                                0
                              ) / teamMembers.length
                            ).toFixed(2)}
                          </span>
                          <span>
                            Didn't exceed 30:{" "}
                            {
                              (
                                (teamMembers.filter((user) => user.score < 31)
                                  .length /
                                  Math.max(1, teamMembers.length)) *
                                100
                              )
                                .toString()
                                .match(/^-?\d+(?:\.\d{0,2})?/)[0]
                            }
                            %
                          </span>
                        </div>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <Collapse
                  in={open[teamNumber] || false}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {teamMembers.map((user, index) => (
                      <ListItem key={user.id}>
                        <div className="full-leaderboard-item" key={index}>
                          <div className="userListRow">
                            <div className="userListRowLeft">
                              <p>
                                {index + 1}. {user.userName}
                              </p>
                              <div className="stats-holder">
                                <p>Turns Count: {user.score}</p>
                                <p>Initial-cards: {user.initialCards}</p>
                                <p>Chests-landed: {user.chestsLanded}</p>
                              </div>
                            </div>
                            {isAdmin && userId !== user.userId && (
                              <button
                                className="removePlayerButton"
                                onClick={() => {
                                  RemovePlayer(user.roomId, user.userId);
                                }}
                              >
                                Remove {user.userName}
                              </button>
                            )}
                          </div>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
      </div>
    </div>
  );
}

export default FinalLeaderBoard;
