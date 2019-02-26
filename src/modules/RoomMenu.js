import React from "react";
import Question from "./Question";
import Answers from "./Answers";


class RoomMenu extends React.Component{
  /* 
  props:
  roomcode:
  questionList: 
  */
  
  renderQuestion(i){
    if(this.props.questionList[i].options){
      return(
        <div className="game-box my-auto col-sm-8 offset-sm-2">
          <Question questionText={this.props.questionList[i].question} />
          {/* {console.log(this.props.questionList[i].options)} */}
          <Answers
            options={this.props.questionList[i].options}
            onClick={()=>{}}
            isOn={true}
          />
        </div>
      );
    }
    else{
      return "";
    }
  }
  render(){
    let questionDisplayList=[];
    for (let i = 0; i < this.props.questionList.length; i++) {
      questionDisplayList.push(this.renderQuestion(i));
    } 
    return(
      <div>
      {questionDisplayList}
      </div>
    )
    // return(
    //   <div>"hi"</div>
    // )
  }
}

export default RoomMenu