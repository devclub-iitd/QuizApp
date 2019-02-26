import React from "react";
import UserInLobby from "./UserInLobby"
class Lobby extends React.Component{
  /* 
  props:
  status: (String)
  socket: socket object (Object)
  roomcode: recieved roomcode (String)
  cb: called when game starts (Takes parent state update)
   */
  constructor(props){
    super(props);
    this.state = {
      userList: this.props.userList,
      status: this.props.status, /* "inactive", "waiting", "collecting", "finish","countdown" */
      startTime: new Date(),
      timeLeft: '',
    };
    this.props.socket.on('start', (payload)=>{
      this.setState({
        startTime:payload.time,
        timeLeft:(payload.time.getTime()-Date.now())/1000|0,
      });
    });
    this.props.socket.on('question', (payload)=>{
      this.props.cb({
        question: payload.question,
        options: payload.options,
        timerEndTime: payload.endtime,
        timerTotalTime: payload.totaltime,
      })
    });
    this.props.socket.on('update', (payload) => {
      this.setState({
        userList: payload.users,
      })
    })
    this.timerID=setInterval(()=>this.tick(),1000);
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      userList: nextProps.userList,
      status: nextProps.roomstatus,
    })
  }
  componentWillUnmount(){
    clearInterval(this.timerID);
    this.props.socket.off('start');
    this.props.socket.off('question');
  }
  tick(){
    if(this.state.status==="countdown"){
      this.setState({
        timeLeft:(this.state.startTime.getTime()-Date.now())/1000|0,
      });
    }
  }

  render(){
    // console.log(this.state.userList);
    // console.log(this.props.userList);
    // console.log(this.props.roomstatus);
    // console.log(this.state.roomstatus);
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
      if(this.state.timeLeft>=0){
        countdown = (
          <div className="countdown">{this.state.timeLeft}</div> 
        )
      }
      else{
        countdown = (
          <div className="countdown">0</div> 
        )
      }
    }
    else{
      countdown = (
        <div className="countdown"></div>
      )
    }
    //Should add unique key to each list element
    return(
      <div className="lobby game-box col-sm-8 offset-sm-2">
        {this.props.roomcode}
        <div className="user-list-in-lobby">
          {userDisplayList} 
          </div>
        {countdown}
        {/* {this.state.status}
        {this.props.status} */}
      </div>
    );
  }
}

export default Lobby