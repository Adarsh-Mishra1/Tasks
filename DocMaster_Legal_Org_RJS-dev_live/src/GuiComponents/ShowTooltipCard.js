import React from "react";

const ShowTooltipCard = (props) => {
  return (
    <>
      <div className="tooltip-card">
        <div className="tooltip_card_body">
          {/* <i class="fa fa-2x fa-caret-up" aria-hidden="true"></i> */}
          {/* <h5 className="card-title">{props.title}</h5> */}
          <p>{props.description}</p>
        </div>
      </div>
    </>
  );
};

export default ShowTooltipCard;
