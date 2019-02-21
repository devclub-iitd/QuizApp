import React from "react";
import Timer from "./Timer";
import Question from "./Question";
import Answers from "./Answers";

class Game extends React.Component {
  /* 
  props:
  socket: socket object
  */
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      options: ["A","B","C","D"],
      questionText: "This is a sample question, or is it?",
      response: -1,
      timerIsOn: true,
      timerEndTime: new Date(),
      timerTotalTime: 10,
    };
    this.state.timerEndTime.setTime(this.state.timerEndTime.getTime()+10000) //temp
  }
  handleTimeout(){
    this.setState({
      timerIsOn: false,
    });
  }
  handleClick(i) {
    if(this.state.timerIsOn){
      this.setState({
        status:1,
        response: i,
        timerIsOn: false,
      });
      this.props.socket.emit('answer',{
        answer:i,
      });
    }
  } 
  render() {
    return (
      <div className="game">
        <div className="response">{this.state.response}</div>
        <Question questionText={this.state.questionText} />
        <Answers
          options={this.state.options}
          onClick={i => this.handleClick(i)}
          isOn={this.state.timerIsOn}
        />
        {/* <TestButton /> */}
        <Timer 
          endTime={this.state.timerEndTime}
          isOn={this.state.timerIsOn}
          totalTime={this.state.timerTotalTime}
          onTimeout={()=>this.handleTimeout()}
        />
      </div>
    );
  }
}

export default Game
