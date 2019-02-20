import React from "react"

function Option(props) {
  /*
    props:
      value: Value to display (Any Type)
      onClick: Onclick function (No args) 
  */
  return (
    <button className="option btn" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Option