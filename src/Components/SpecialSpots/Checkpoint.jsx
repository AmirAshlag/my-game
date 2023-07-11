import React from 'react'
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Checkpoint({ userLocation, box, i }) {
  return (
    <div className="box">
      <img src={box.imgurl} alt="" className="checkpoint-img" />
      {userLocation === i && <FontAwesomeIcon icon={faUser} className="user" />}
    </div>
  );
}

export default Checkpoint
