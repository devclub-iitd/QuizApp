import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import openSocket from 'socket.io-client';

import Timer from "./modules/Timer";
import Question from "./modules/Question";
import Answers from "./modules/Answers";

const SERVER_URL = 'http://10.184.17.101:3001';

const socket = openSocket(SERVER_URL);
  
// class TestButton extends React.Component{
//   ping(){
//     socket.on('ping', (payload) => {
//       socket.emit('pingu',payload);
//       console.log(payload);
//     })
//   }
//   render(){
//     console.log("I rendered");
//     return (
//       <button onClick={()=>this.ping()}>HI</button>
//     )
//   }
// }
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      options: ["A","B","C","D"],
      questionText: "This is a sample question, or is it?",
      response: -1,
      timerIsOn: true,
      timerEndTime: new Date(),
      timerTotalTime: 10000,
    };
    this.state.timerEndTime.setTime(this.state.timerEndTime.getTime()+10000)
  }
  handleClick(i) {
    this.setState({
      status:1,
      response: i,
    });
    socket.emit('answer',{
      answer:i,
    })
  } 
  render() {
    return (
      <div className="game">
        <div className="response">{this.state.response}</div>
        <Question questionText={this.state.questionText} />
        <Answers
          options={this.state.options}
          onClick={i => this.handleClick(i)}
        />
        {/* <TestButton /> */}
        <Timer 
          endTime={this.state.timerEndTime}
          isOn={this.state.timerIsOn}
          totalTime={this.state.timerTotalTime}
        />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
