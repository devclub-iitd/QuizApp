import React from "react";
import Timer from "./Timer";
import Question from "./Question";
import Answers from "./Answers";
import Leaderboard from "./Leaderboard";

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
      questionIndex:1,
      isLast:false,
      results:"",
    };
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      options: nextProps.options,
      questionText: nextProps.question,
      timerEndTime: nextProps.timerEndTime,
      timerTotalTime: nextProps.timerTotalTime,
    }); 
  }
  componentDidMount(){
    // console.log("mounting");
    this.props.socket.on('leaderboard',(payload)=>{
      if(payload.isnotlive){
        this.props.cb({result:payload.leaderboard});
      }
      else{
        this.setState({
          results:payload.leaderboard,
        });
      }
      // console.log("hi",payload,this.state)
    })
    this.props.socket.on('question',(payload)=>{
      this.setState({
        questionText: payload.question,
        options: payload.options,
        timerEndTime: payload.endtime,
        timerTotalTime: payload.totaltime,
        isLast:payload.islast,
        timerIsOn: true,
        questionIndex: this.state.questionIndex+1,//make it question ka index + 1 aoid double click problems
      })
      console.log("Question reply:")
      console.log(payload)
    });
    // console.log("mounted");
  }
  componentWillUnmount(){
    this.props.socket.off('question');
    this.props.socket.off('leaderboard');
  }
  handleTimeout(){
    this.setState({
      timerIsOn: false,
    });
  }
  broadcastNext(){
    // console.log("broadcast"+this.state.questionIndex);
    this.props.socket.emit('next',{
      serial:this.state.questionIndex,
      roomid:this.props.roomcode,
    });
    console.log(this.state.questionIndex);
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
          serial:this.state.questionIndex-1,
        });
        // console.log(this.props.roomcode);
        // console.log(this.state);
        // console.log(this.props);
      }
    }
  } 
  render() {
    let nextButton="";
    let buttonText="Next Question";
    let board="";
    let gameBoxClass="col-sm-8 offset-sm-2";
    if(this.state.isLast){
      buttonText="View Leaderboard"
    }
    if(this.props.isQM){
      if(this.state.timerIsOn){
        nextButton=<button className="btn btn-primary disabled">{buttonText}</button>;
      }
      else{
        nextButton=<button className="btn btn-primary" onClick={()=>this.broadcastNext()}>{buttonText}</button>;
      }
      if(this.state.results){
        board=(
          <div className="game-box my-auto col-sm-6">
          <Leaderboard
            result={this.state.results}
            username={this.props.username}
            back={()=>{}}
          />
          </div>
        );
        gameBoxClass="col-sm-4";
      }
    }
    if(this.state.questionText){
      return (
        <div className="row h-100">
          <div className={"game-box my-auto "+gameBoxClass}>
            {/* <div className="response">{this.state.response}</div> */}
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
          {board}
        </div>
      );
    }
    else{
      return(
        <div className="row h-100">
          <div className="game-box my-auto col-sm-6 offset-sm-2">
            Please Wait For The Next Question
          </div>
        </div>
      );
    }
  }
}

export default Game
