import React from "react";
import Question from "./Question";
import Answers from "./Answers";
import Loading from "./Loading";


class RoomMenu extends React.Component{
  /* 
  props:
  roomcode:
  questionList: 
  cbs: ....
  socket
  */
  constructor(props){
    super(props);
    this.state={
      isWaiting:false,
      message:"",
    }
  }
  renderQuestion(i){
    if(this.props.questionList[i].options){
      return(
        <div className="game-box my-auto col-sm-8 offset-sm-2">
          <Question questionText={this.props.questionList[i].question} />
          {/* {console.log(this.props.questionList[i].options)} */}
          <Answers
            options={this.props.questionList[i].options}
            onClick={()=>{}}
            isOn={true}
          />
        </div>
      );
    }
    else{
      return "";
    }
  }
  activateRoom(){
    this.props.socket.emit('activate',{
      roomid: this.props.roomCode,
    })
    this.setState({
      isWaiting:true,
    });
  }
  handleActivateResponse(payload){
    if(payload.message==="Success"){
      this.props.cb({
        roomcode: this.props.roomCode,
        // roomstatus: payload.state,
        userlist: payload.users,
      })
      // console.log(payload);
      this.props.activateRoomCB();
    }
    else{
      this.setState({
        isWaiting:false,
        message:payload.message,
      })
    }
  }
  render(){
    if(this.state.isWaiting){
      return (
        <Loading
          text={"Activating Room..."}
          socket={this.props.socket}
          time={5000}
          listenFor={'activate'}
          onSuccess={(payload)=>this.handleActivateResponse(payload)}
          onFailure={()=>{this.setState({isWaiting:false, message: "Time Out"})}} 
          onCancel={()=>{this.setState({isWaiting:false, message: ""})}}
        />
      );
    }
    let questionDisplayList=[];
    for (let i = 0; i < this.props.questionList.length; i++) {
      questionDisplayList.push(this.renderQuestion(i));
    } 
    return(
      <div className="card">
        <div className="card-body">
          <div className="form-group">
            <button className="form-control"  onClick={()=>this.props.addQuestionCB()}>Add Question</button>
            <button className="form-control" onClick={()=>this.props.viewLeaderBoardCB()}>View Leaderboard (non func) </button>
            <button className="form-control" onClick={()=>this.activateRoom()}>Activate Room</button>
          </div>
            {questionDisplayList}
        </div>
      </div>
    )
    // 
    // )
  }
}

export default RoomMenu