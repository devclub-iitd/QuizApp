import React from "react";

function Question(props){
  /* 
  props:
  questionText: Text to display (String) 
  */
  return(
    <div className="question" dangerouslySetInnerHTML={{__html: props.questionText}}></div>
  );
}

export default Question