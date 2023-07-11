import "./Card.css";

function Card({ card }) {
  return (
    <div className="card">
      <div className={`card-header ${card.type}`}>
        <h2>Full-kit {card.id}</h2>
      </div>
      <div className="card-body">
        <p>{card.text}</p>
      </div>
    </div>
  );
}

export default Card;
