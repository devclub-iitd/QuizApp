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
      loadInstr:"Open", /* "Add" */
      newroomcode:"",
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
  handleAddResponse(payload){
    this.setState({
      isWaiting:false,
    })
    this.props.cb({
      roomcodeList:payload.rooms,
    },"RoomListScreen")
  }
  fetchRoom(roomcode){
    this.setState({
      isWaiting:true,
      loadInstr:"Open",
      roomcode: roomcode,
    });
    this.props.socket.emit('fetchroom',{
      roomid:roomcode,
    });
    // console.log("click");
  }
  renderLoading(roomcode){
    // console.log(this.state.isWaiting);
    if(this.state.loadInstr==="Open"){
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
    else{
      return(
        <Loading
          text={"Adding Room..."}
          socket={this.props.socket}
          time={5000}
          listenFor={'createroom'}
          onSuccess={(payload)=>this.handleAddResponse(payload)}
          onFailure={()=>{this.setState({isWaiting:false, message: "Time Out"})}} 
          onCancel={()=>{this.setState({isWaiting:false, message: ""})}}
        />
      );
    }
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
  addRoom(event){
    event.preventDefault();
    // this.setState({
    //   username: "Submit Function Called",
    // });
    if(this.state.newroomcode){
      this.props.socket.emit('createroom',{
        qm: this.props.username,
        roomid: this.state.newroomcode,
      });
      this.setState({
        isWaiting: true,
        loadInstr:"Add",
      });
      // console.log("adsads");
    }
  }
  takeTextInput(event, stateField){
    let stateUpdate={};
    stateUpdate[stateField]=event.target.value;
    this.setState(stateUpdate);
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
          <form onSubmit={(event)=>this.addRoom(event)}>
            <div className="form-group">
              <label>
                New Room Code: 
              </label>

              <input type="text" className="form-control" onChange={(event)=>this.takeTextInput(event,"newroomcode")} />
            </div>
            <input type="submit" className="form-control" value="Create New Room" />
          </form>
        </div>
      </div>
    );
  }
}

export default RoomListScreen;