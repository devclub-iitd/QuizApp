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
    buttonClass="option col-12";
  }
  else{
    buttonClass="option option-grey col-12";
  }
  return (
    <button className={buttonClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Option