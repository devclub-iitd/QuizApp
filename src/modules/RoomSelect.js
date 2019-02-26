import React from "react";
import Loading from "./Loading";

class RoomSelect extends React.Component{
  /* 
  props:
  cb: What to do when room is selected (Takes state object for index)
  username: username (String)
  socket: socket object (Object)
  */
  constructor(props){
    super(props);
    this.state={
      roomcode: "",
      isWaiting: false,
      message: "",
    }
  }

  //Identical to login. Better way?
  takeTextInput(event, stateField){
    let stateUpdate={};
    stateUpdate[stateField]=event.target.value;
    this.setState(stateUpdate);
  }
  //

  handleSubmit(event){
    event.preventDefault();
    this.props.socket.emit('joinroom',{
      roomid: this.state.roomcode,
      username: this.props.username,
    });
    // console.log({
    //   roomid: this.state.roomcode,
    //   username: this.state.username,
    // })
    this.setState({
      isWaiting: true,
    });
  }

  handleRoomResponse(payload){
    if(payload.message==="Success"){
      let stateUpdate={
        roomcode: this.state.roomcode,
        roomstatus: payload.status,
        // userlist: payload.userlist,
      }
      if(payload.state==="countdown" || payload.state==="waiting" || payload.state==="collecting"){
        this.props.cb(stateUpdate,"Playing");
      }
      else{
        this.props.cb(stateUpdate,"InLobby");
      }
    }
    else{
      this.setState({
        isWaiting: false,
        message: payload.message,
      })
    }
  }
  render(){
    if(this.state.isWaiting){
      return(
        <Loading 
          text={"Looking for room..."}
          socket={this.props.socket}
          time={5000}
          listenFor={'joinroom'}
          onSuccess={(payload)=>this.handleRoomResponse(payload)}
          onFailure={()=>{this.setState({isWaiting:false, message: "Time Out"})}} 
        />
      );
    }
    return(
      <div className="game-box col-sm-8 offset-sm-2">
        {this.state.message}
        <form onSubmit={(event)=>this.handleSubmit(event)}>
          <label>
            RoomCode: 
            <input type="text" value={this.state.value} onChange={(event)=>this.takeTextInput(event,"roomcode")} />
          </label>
          <input type="submit" value="Submit" />
        </form> 
      </div>
    );
  }
}

export default RoomSelect;