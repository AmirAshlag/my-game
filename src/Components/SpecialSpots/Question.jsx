import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SpecialSpots.css";

function Question({ userLocation, box, i }) {

  return (
    <div className={["box2"].join(" ")}>
      <img src={box.imgurl} alt="" className="question-img" />
      {userLocation === i && <FontAwesomeIcon icon={faUser} className="user" />}
    </div>
  );
}

export default Question;


