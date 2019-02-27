import React from "react";
import Loading from "./modules/Loading";
import Option from "./modules/Option";


class RoomListScreen extends React.Component{
  /*
  props:
  socket:
  roomcodeList:
  cb: takes state update 
  */
  constructor(props){
    super(props);
    this.state={
      isWaiting: false,
      roomcode: "",
      message:"",
    }
  }
  handleRoomResponse(payload,roomcode){
    // console.log(roomcode)
    this.props.cb({
      questionList: payload.questions,
      roomcode: roomcode,
    },"ViewingRoom");
    // console.log(payload)
  }
  fetchRoom(roomcode){
    this.setState({
      isWaiting:true,
      roomcode: roomcode,
    });
    this.props.socket.emit('fetchroom',{
      roomid:roomcode,
    });
    // console.log("click");
  }
  renderLoading(roomcode){
    // console.log(this.state.isWaiting);
    return(
      <Loading
        text={"Loading Room..."}
        socket={this.props.socket}
        time={5000}
        listenFor={'fetchroom'}
        onSuccess={(payload)=>this.handleRoomResponse(payload,roomcode)}
        onFailure={()=>{this.setState({isWaiting:false, message: "Time Out"})}} 
        onCancel={()=>{this.setState({isWaiting:false, message: ""})}}
      />
    );
  }
  renderRoomButton(roomcode){
    return(
      <Option
        value={"RoomCode: "+roomcode}
        onClick={()=>this.fetchRoom(roomcode)}
        isOn={true}
      />
    );
  }
  render(){
    if(this.state.isWaiting){
      return this.renderLoading(this.state.roomcode);
    }
    let roomDisplayList=[];
    this.props.roomcodeList.forEach(element => {
      roomDisplayList.push(
        this.renderRoomButton(element),
      )
    });
    return(
      <div className="row h-100">
        <div className="game-box my-auto col-sm-8 offset-sm-2">
        <div className="alert alert-warning alert-dismissible"> Rooms: 
          <button type="button" className="close" onClick={()=>this.props.back()}>Back</button>          
          </div>
          {roomDisplayList}
        </div>
      </div>
    );
  }
}

export default RoomListScreen;