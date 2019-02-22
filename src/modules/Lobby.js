import React from "react";
import UserInLobby from "./UserInLobby"
class Lobby extends React.Component{
  /* 
  props:
  cb: called when game starts
   */
  constructor(props){
    super(props);
    this.state = {
      userList: ["user1","user2","user3","user4"],
      status: "Starting Soon", /* "Waiting For QM", "Started" */
      startTime: new Date(),
      timeLeft: 100,
    };
    this.state.startTime.setTime(this.state.startTime.getTime()+10000); //temp
    this.timerID=setInterval(()=>this.tick(),1000);
  }
  componentWillUnmount(){
    clearInterval(this.timerID);
  }
  tick(){
    if(this.state.status==="Starting Soon"){
      this.setState({
        timeLeft:(this.state.startTime.getTime()-Date.now())/1000|0,
      });
    }
    if(((this.state.startTime.getTime()-Date.now())/1000|0) <= 0){ //Maybe 1?
      this.props.cb();
    }
  }
  render(){
    let userDisplayList=[];
    let countdown;
    this.state.userList.forEach(element => {
      userDisplayList.push(
        <UserInLobby
          name={element}
        />
      )
    });
    if(this.state.status==="Starting Soon"){
      countdown = (
        <div className="countdown">{this.state.timeLeft}</div> 
      )
    }
    else{
      countdown = (
        <div className="countdown"></div>
      )
    }
    //Should add unique key to each list element
    return(
      <div className="lobby game-box">
        <div className="user-list-in-lobby">
          {userDisplayList} 
          </div>
        {countdown}
      </div>
    );
  }
}

export default Lobby