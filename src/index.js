import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import openSocket from 'socket.io-client';

import Game from "./modules/Game";
import Lobby from "./modules/Lobby";
import Login from "./modules/Login";
import RoomSelect from "./modules/RoomSelect";

const SERVER_URL = 'http://10.184.17.101:3001';
const socket = openSocket(SERVER_URL);
  
class QuizApp extends React.Component{

  // Split into QM path and User path separately?

  constructor(props){
    super(props);
    this.state={
      status: "LoggingIn" /* "LoggingIn","InLobby","Playing","SelectingRoom" */,
      username: "",
      isQM: false,
      roomstatus:"",
      question:"",
      options:"",
      timerEndTime: new Date(),
      timerTotalTime: 30,
      userlist:["iw"],
    }
  }
  setStatus(s){
    this.setState({
      status: s,
    });
  }
  setStateAndStatus(stateUpdate,status){
    this.setStatus(status);
    this.setState(stateUpdate);
  }
  renderLogin(){
    return(
      <Login 
        cb={(stateUpdate)=>this.setStateAndStatus(stateUpdate, "SelectingRoom")}
        socket={socket}
      />
    )
  }
  renderGame(){
    return(
      <Game 
        socket={socket}
        options={this.state.options}
        question={this.state.question}
        timerEndTime={this.state.timerEndTime}
        timerTotalTime={this.state.timerTotalTime}
      />
    );
  }
  renderLobby(){
    return (
      // <div>
        // <div className="game-box">{this.state.username}</div>
        <Lobby 
          roomstatus={this.state.roomstatus}
          roomcode={this.state.roomcode}
          socket={socket}
          cb={(stateUpdate)=>this.setStateAndStatus(stateUpdate,"Playing")}
          status={this.state.roomstatus}
          userList={this.state.userlist}
        />
      // </div>
    );
  }
  renderRoomSelect(){
    return(
      <RoomSelect 
        cb={(stateUpdate, nextParentState)=>this.setStateAndStatus(stateUpdate, nextParentState)}
        socket={socket}
        username={this.state.username}
      />
    )
  }

  render(){
    // console.log(this.state.userlist)
    // console.log("hi")
    if(this.state.status==="LoggingIn"){
      return this.renderLogin();
    }
    else if(this.state.status==="InLobby"){
      return this.renderLobby();
    }
    else if(
      this.state.status==="Playing"){
      return this.renderGame();
    }
    else if(this.state.status==="SelectingRoom"){
      return this.renderRoomSelect();
    }
  }
}


// ========================================

ReactDOM.render(<QuizApp />, document.getElementById("root"));
