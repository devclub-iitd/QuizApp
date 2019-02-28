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
        roomstatus: payload.state,
        userlist: payload.users,
      }
      // console.log(payload);
      if(payload.state==="countdown" || payload.state==="waiting" || payload.state==="collecting"){
        this.props.cb(stateUpdate,"Playing");
      }
      else if(payload.state==="finish"){
        stateUpdate.result=payload.leaderboard;
        this.props.cb(stateUpdate,"Leaderboard");
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
          onCancel={()=>{this.setState({isWaiting:false, message: ""})}} 
        />
      );
    }
    return(
      <div className="row h-100">
        <div className="game-box my-auto col-sm-8 offset-sm-2"> 
          {this.state.message}
          <div className="alert alert-warning alert-dismissible"> RoomCode: 
          <button type="button" className="close" onClick={()=>this.props.back()}>Back</button>
          <button type="button" className="close" onClick={()=>this.props.back()}>Back</button>

        </div>
          <form onSubmit={(event)=>this.handleSubmit(event)}>
            <div className="form-group">
              
              <input className="form-control"type="text" value={this.state.value} onChange={(event)=>this.takeTextInput(event,"roomcode")} />
            </div>
            <input className="form-control" type="submit" value="Submit" />
          </form> 
        </div>
      </div>
    );
  }
}

export default RoomSelect;