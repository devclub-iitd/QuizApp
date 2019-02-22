import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import openSocket from 'socket.io-client';

import Game from "./modules/Game";
import Lobby from "./modules/Lobby";
import Login from "./modules/Login";

const SERVER_URL = 'http://10.184.17.101:3001';
const socket = openSocket(SERVER_URL);
  
class QuizApp extends React.Component{
  constructor(props){
    super(props);
    this.state={
      status: "LoggingIn",
      username: "hey",
      isQM: false,
    }
  }
  renderGame(){
    return(
      <Game 
        socket={socket}
      />
    );
  }
  setStatus(s){
    this.setState({
      status: s,
    });
  }
  setLoginStatus(stateUpdate){
    this.setStatus("InLobby");
    this.setState(stateUpdate);
  }
  renderLogin(){
    return(
      <Login 
        cb={(stateUpdate)=>this.setLoginStatus(stateUpdate)}
      />
    )
  }
  renderLobby(){
    return (
      <div>
        <div className="game-box">{this.state.username}</div>
        <Lobby 
          socket={socket}
          cb={()=>this.setStatus("Playing")}
        />
      </div>
    );
  }

  render(){
    if(this.state.status==="LoggingIn"){
      return this.renderLogin();
    }
    else if(this.state.status==="InLobby"){
      return this.renderLobby();
    }
    else if(this.state.status==="Playing"){
      return this.renderGame();
    }
  }
}


// ========================================

ReactDOM.render(<QuizApp />, document.getElementById("root"));
