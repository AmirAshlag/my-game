import { useRef } from "react";
import ReactDice from "react-dice-complete";

function Dice({ MoveUser, loaded, disabledDice, setDisabledDice }) {
  const reactDice = useRef(null);

  const rollDone = (totalValue, values) => {
    if (loaded) {
      MoveUser(totalValue, false);
    }
  };

  return (
    <div
    onClick={() => {
      console.log(disabledDice);
      if (loaded && !disabledDice) {
        setDisabledDice(true);
      }
    }}
    >
      <ReactDice
        numDice={1}
        useRef={reactDice}
        rollDone={rollDone}
        className="dice"
        defaultRoll={1}
        faceColor="rgb(0, 0, 0)"
        dotColor="rgb(255,255,255)"
        rollTime="1.2"
        disableIndividual={disabledDice}
      />
    </div>
  );
}

export default Dice;
