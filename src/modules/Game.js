import React from "react";
import Timer from "./Timer";
import Question from "./Question";
import Answers from "./Answers";

// TODO: Handle state where we are too early for questions to start 
class Game extends React.Component {
  /* 
  props:
  socket: socket object (Object)
  options: options JSON
  question: HTML
  timerEndTime: ending time (Date)
  timerTotalTime: max time for a question in seconds (Integer)
  */
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      options: this.props.options,
      questionText: this.props.question,
      response: -1, //temp
      timerIsOn: true,
      timerEndTime: this.props.timerEndTime,
      timerTotalTime: this.props.timerTotalTime,
    };
    this.props.socket.on('question',(payload)=>{
      this.setState({
        question: payload.question,
        options: payload.options,
        timerEndTime: payload.endtime,
        timerTotalTime: payload.totaltime,
        timerIsOn: true,
      })
    });
    
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      options: nextProps.options,
      questionText: nextProps.question,
      timerEndTime: nextProps.timerEndTime,
      timerTotalTime: nextProps.timerTotalTime,
    })
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
    if(this.state.questionText){
      return (
        <div className="game-box col-sm-8 offset-sm-2">
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
    else{
      return(
        <div className="game-box col-sm-8 offset-sm-2">
        Please Wait For The Next Question
        </div>
      );
    }
  }
}

export default Game
