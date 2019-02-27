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

  roomcode
  username
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
      questionIndex:0,
    };
    this.props.socket.on('question',(payload)=>{
      this.setState({
        question: payload.question,
        options: payload.options,
        timerEndTime: payload.endtime,
        timerTotalTime: payload.totaltime,
        timerIsOn: true,
        questionIndex: this.state.questionIndex+1,
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
  broadcastNext(){
    console.log("broadcast"+this.state.questionIndex);
    // this.props.socket.emit('next',{
    //   serial:this.state.questionIndex,
    // });
  }
  handleClick(i) {
    if(!this.props.isQM){
      if(this.state.timerIsOn){
        this.setState({
          status:1,
          response: i,
          timerIsOn: false,
        });
        this.props.socket.emit('attempt',{ //potentially problematic, unreliable
          attempt:i,
          roomid:this.props.roomcode,
          username:this.props.username,
          serial:this.state.questionIndex,
        });
        console.log(this.props.roomcode);
        console.log(this.state);
        console.log(this.props);
      }
    }
  } 
  render() {
    let nextButton=""
    if(this.props.isQM){
      if(this.state.timerIsOn){
        nextButton=<button className="btn btn-primary disabled">Next Question</button>;
      }
      else{
        nextButton=<button className="btn btn-primary" onClick={()=>this.broadcastNext()}>Next Question</button>;
      }
    }
    if(this.state.questionText){
      return (
        <div className="row h-100">
          <div className="game-box my-auto col-sm-8 offset-sm-2">
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
            {nextButton}
          </div>
        </div>
      );
    }
    else{
      return(
        <div className="row h-100">
          <div className="game-box my-auto col-sm-8 offset-sm-2">
            Please Wait For The Next Question
          </div>
        </div>
      );
    }
  }
}

export default Game
