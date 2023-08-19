import { useRef, useState } from "react";
import ReactDice, { ReactDiceRef } from "react-dice-complete";

function Dice({ MoveUser, loaded, disabledDice, setDisabledDice }) {
  const reactDice = useRef(null);

  const rollDone = (totalValue, values) => {
    if (loaded) {
      MoveUser(totalValue, false);
    }
  };

  return (
    <div
      className="dice-container"
      style={{ cursor: "grab"}}
      onClick={() => {
        console.log(disabledDice);
        if (loaded && !disabledDice) {
          reactDice.current.rollAll();
          setDisabledDice(true);
        }
      }}
    >
      <ReactDice
        numDice={1}
        ref={reactDice}
        rollDone={rollDone}
        defaultRoll={1}
        faceColor="rgb(0, 0, 0)"
        dotColor="rgb(255,255,255)"
        rollTime="1.2"
        disableIndividual
      />
    </div>
  );
}

export default Dice;
