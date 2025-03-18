import React from "react";

const StepsCard = (props) => {
  return (
    <>
      <div className="stepsCard">
        <div className="number">{props.number}</div>
        <div className="stepsCardContent">
          <div className="">{props.content}</div>
          <div className="">{props.content2}</div>
        </div>
      </div>
    </>
  );
};

export default StepsCard;
