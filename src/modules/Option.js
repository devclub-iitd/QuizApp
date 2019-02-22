import React from "react"

function Option(props) {
  /*
    props:
      value: Value to display (Any Type)
      onClick: Onclick function (No args) 
      isOn: Whether timer is on (Boolean)
  */
  let buttonClass;
  if(props.isOn){
    buttonClass="option";
  }
  else{
    buttonClass="option option-grey";
  }
  return (
    <button className={buttonClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Option