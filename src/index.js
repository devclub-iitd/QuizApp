import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import openSocket from 'socket.io-client';

import Game from "./modules/Game";
import Lobby from "./modules/Lobby";

const SERVER_URL = 'http://10.184.17.101:3001';
const socket = openSocket(SERVER_URL);
  
class QuizApp extends React.Component{
  renderGame(){
    return(
      <Game 
        socket={socket}
      />
    );
  }
  renderLogin(){
  }
  renderLobby(){
    return (
      <Lobby 
        socket={socket}
      />
    );
  }

  render(){
    return this.renderLobby();
  }
}


// ========================================

ReactDOM.render(<QuizApp />, document.getElementById("root"));
