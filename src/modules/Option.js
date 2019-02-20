import React from "react"

function Option(props) {
  /*
    props:
      value: Value to display (Any Type)
      onClick: Onclick function (No args) 
  */
  return (
    <button className="option col-12" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Option