import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import openSocket from 'socket.io-client';

import Game from "./modules/Game";
import Lobby from "./modules/Lobby";

const SERVER_URL = 'http://10.184.17.101:3001';
const socket = openSocket(SERVER_URL);
  
class QuizApp extends React.Component{
  constructor(props){
    super(props);
    this.state={
      status: "Playing",
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
  renderLogin(){
  }
  renderLobby(){
    return (
      <Lobby 
        socket={socket}
        cb={()=>this.setStatus("Playing")}
      />
    );
  }

  render(){
    if(this.state.status==="LoggingIn"){
      return this.renderLogin();
    }
    else if(this.state.status==="AtLobby"){
      return this.renderLobby();
    }
    else if(this.state.status==="Playing"){
      return this.renderGame();
    }
  }
}


// ========================================

ReactDOM.render(<QuizApp />, document.getElementById("root"));
