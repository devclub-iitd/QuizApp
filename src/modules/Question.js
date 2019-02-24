import React from "react";

function Question(props){
  /* 
  props:
  questionText: Text to display (String) 
  */
  return(
    <div className="question">{props.questionText}</div>
  );
}

export default Question