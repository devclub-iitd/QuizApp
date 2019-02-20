import React from "react";

function Question(props){
  /* 
  props:
    questionText: Test to display 
  */
  return(
    <div className="question">{props.questionText}</div>
  );
}

export default Question