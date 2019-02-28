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
      loadInstr: "Activate", /* "Delete", "Leaderboard" */
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
          <button onClick={()=>this.deleteQuestion(this.props.questionList[i].id)} className="btn btn-warning-outline">Delete Question</button> 
        </div>
      );
    }
    else{
      return "";
    }
  }
  fetchLeaderboard(){
    this.props.socket.emit('leaderboard',{
      roomid: this.props.roomcode,
    })
    this.setState({
      isWaiting:true,
      loadInstr:"Leaderboard",
    });
  }
  activateRoom(){
    this.props.socket.emit('activate',{
      roomid: this.props.roomcode,
    })
    this.setState({
      isWaiting:true,
      loadInstr:"Activate",
    });
  }
  deleteQuestion(i){
    this.props.socket.emit('deletequestion',{
      id: i,
      roomid: this.props.roomcode,
    })
    this.setState({
      isWaiting:true,
      loadInstr:"Delete"
    })
  }
  handleActivateResponse(payload){
    // if(payload.message==="Success"){
    //   if(payload.state==="countdown" || payload.state==="waiting" || payload.state==="collecting"){
    //     this.props.cb({roomcode: roomcode},"Playing");
    //   }
    //   else if(payload.state==="finish"){
    //     this.props.cb({roomcode: roomcode, result:payload.leaderboard},"Leaderboard");
    //   }
    //   else{
    //     this.props.cb({
    //       questionList: payload.questions,
    //       roomcode: roomcode,
    //     },"ViewingRoom");
    //   }
    // }
    if(payload.message==="Success"){
      this.props.cb({
        roomcode: this.props.roomcode,
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
  handleLeaderboardResponse(payload){
    if(payload.message==="Success"){
      this.props.cb({
        result:payload.leaderboard,
      });
      // console.log(payload);
      this.setState({
        isWaiting:false,
      })
      this.props.viewLeaderBoardCB();
    }
    else{
      this.setState({
        isWaiting:false,
        message:payload.message,
      })
    }
  }
  handleDeleteResponse(payload){
    if(payload.message==="Success"){
      this.props.cb({
          questionList:payload.questions,
        // roomcode: this.props.roomcode,
        // roomstatus: payload.state,
        // userlist: payload.users,
      })
      this.setState({
        isWaiting:false,
      })
      // console.log(payload);
      // this.props.activateRoomCB();
    }
    else{
      this.setState({
        isWaiting:false,
        message:payload.message,
      })
      // console.log(payload);
    }
  }
  render(){
    if(this.state.isWaiting){
      if(this.state.loadInstr==="Activate"){
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
      else if(this.state.loadInstr==="Leaderboard"){
        return (
          <Loading
            text={"Loading Leaderboard..."}
            socket={this.props.socket}
            time={5000}
            listenFor={'leaderboard'}
            onSuccess={(payload)=>this.handleLeaderboardResponse(payload)}
            onFailure={()=>{this.setState({isWaiting:false, message: "Time Out (Deletion Request Still Sent)"})}} 
            onCancel={()=>{this.setState({isWaiting:false, message: "Response Cancelled (Deletion Request Still Sent)"})}}
          />
        );
      }
      else{
        return (
          <Loading
            text={"Deleting Question..."}
            socket={this.props.socket}
            time={15000}
            listenFor={'deletequestion'}
            onSuccess={(payload)=>this.handleDeleteResponse(payload)}
            onFailure={()=>{this.setState({isWaiting:false, message: "Time Out (Deletion Request Still Sent)"})}} 
            onCancel={()=>{this.setState({isWaiting:false, message: "Response Cancelled (Deletion Request Still Sent)"})}}
          />
        );
      }
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
            <button className="form-control" onClick={()=>this.fetchLeaderboard()}>View Leaderboard (non func) </button>
            <button className="form-control" onClick={()=>this.activateRoom()}>Activate Room</button>
          </div>
          <div className="alert alert-warning alert-dismissible"> RoomCode: {this.props.roomcode}
          <button type="button" className="close" onClick={()=>this.props.back()}>Back</button>
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