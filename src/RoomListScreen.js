import React from "react";
import Loading from "./modules/Loading";
import Option from "./modules/Option";


class RoomListScreen extends React.Component{
  /*
  props:
  socket:
  roomCodeList:
  cb: takes state update 
  */
  constructor(props){
    super(props);
    this.state={
      isWaiting: false,
      roomCode: "",
      message:"",
    }
  }
  handleRoomResponse(payload,roomCode){
    // console.log(roomCode)
    this.props.cb({
      questionList: payload.questions,
      roomCode: roomCode,
    },"ViewingRoom");
    // console.log(payload)
  }
  fetchRoom(roomCode){
    this.setState({
      isWaiting:true,
      roomCode: roomCode,
    });
    this.props.socket.emit('fetchroom',{
      roomid:roomCode,
    });
    // console.log("click");
  }
  renderLoading(roomCode){
    // console.log(this.state.isWaiting);
    return(
      <Loading
        text={"Loading Room..."}
        socket={this.props.socket}
        time={5000}
        listenFor={'fetchroom'}
        onSuccess={(payload)=>this.handleRoomResponse(payload,roomCode)}
        onFailure={()=>{this.setState({isWaiting:false, message: "Time Out"})}} 
        onCancel={()=>{this.setState({isWaiting:false, message: ""})}}
      />
    );
  }
  renderRoomButton(roomCode){
    return(
      <Option
        value={"RoomCode: "+roomCode}
        onClick={()=>this.fetchRoom(roomCode)}
        isOn={true}
      />
    );
  }
  render(){
    if(this.state.isWaiting){
      return this.renderLoading(this.state.roomCode);
    }
    let roomDisplayList=[];
    this.props.roomCodeList.forEach(element => {
      roomDisplayList.push(
        this.renderRoomButton(element),
      )
    });
    return(
      <div className="row h-100">
        <div className="game-box my-auto col-sm-8 offset-sm-2">
          {roomDisplayList}
        </div>
      </div>
    );
  }
}

export default RoomListScreen;