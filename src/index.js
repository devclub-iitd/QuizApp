import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import openSocket from 'socket.io-client';

import Game from "./modules/Game";
import Lobby from "./modules/Lobby";
import Login from "./modules/Login";
import RoomSelect from "./modules/RoomSelect";
import RoomListScreen from './RoomListScreen';
import RoomMenu from './modules/RoomMenu';
import AddQuestion from './modules/AddQuestion';

const SERVER_URL = 'http://10.184.17.101:3001';
const socket = openSocket(SERVER_URL);
  
class QuizApp extends React.Component{

  // Split into QM path and User path separately?

  constructor(props){
    super(props);
    this.state={
      status: "LoggingIn" /* "LoggingIn","InLobby","Playing","SelectingRoom","RoomListScreen","ViewingRoom", "AddingQuestion" */,
      username: "",
      isQM: false,
      roomstatus:"",
      question:"",
      options:"",
      timerEndTime: new Date(),
      timerTotalTime: 30,
      userlist:["iw"],
      roomCodeList: ["aw"],
      questionList:[""],
      roomCode:"",
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
        cb={(stateUpdate,nextStatus)=>this.setStateAndStatus(stateUpdate, nextStatus)}
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
  renderRoomListScreen(){
    return(
      <RoomListScreen
        socket={socket}
        roomCodeList={this.state.roomCodeList}
        cb={(stateUpdate,nextStatus)=>this.setStateAndStatus(stateUpdate,nextStatus)}
      />
    )
  }
  renderRoomMenu(){
    return(
      <RoomMenu
        questionList={this.state.questionList}
        cb={()=>this.setStatus("AddingQuestion")}
      />
    );
  }
  renderAddQuestion(){
    return (
      <AddQuestion
        roomCode={this.state.roomCode}
        socket={socket}
        cb={(stateUpdate)=>this.setStateAndStatus(stateUpdate,"ViewingRoom")}
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
    else if(this.state.status==="RoomListScreen"){
      return this.renderRoomListScreen();
    }
    else if(this.state.status==="ViewingRoom"){
      return this.renderRoomMenu();
    }
    else if(this.state.status==="AddingQuestion"){
      return this.renderAddQuestion();
    }
  }
}


// ========================================

ReactDOM.render(<QuizApp />, document.getElementById("root"));
