import React from "react"
import Loading from "./Loading.js"
class Login extends React.Component{
  /* 
  props:
  socket: socket object (Object)
  cb: What to do when logged in (Takes state object for index)
  */
  constructor(props){
    super(props);
    this.state={
      isQM: false,
      isWaiting: false,
      username: "",
      email: "",
      password: "",
      phone: "",
      message: "",
    }
  }
  takeTextInput(event, stateField){
    let stateUpdate={};
    stateUpdate[stateField]=event.target.value;
    this.setState(stateUpdate);
  }
  handleSubmit(event){
    event.preventDefault();
    // this.setState({
    //   username: "Submit Function Called",
    // });
    this.props.socket.emit('login',{
      username: this.state.username,
      isQM: this.state.isQM,
      phone: this.state.phone,
      email: this.state.email,
      password: this.state.password,
    });
    this.setState({
      isWaiting: true,
    });
    // this.props.cb({
    //   isQM: this.state.isQM,
    //   username: this.state.username,
    // });
  }
  handleLoginResponse(payload){
    if(payload.message==="Success"){
      let stateUpdate = {
        username: this.state.username,
        isQM: this.state.isQM,
      }
      let nextState="SelectingRoom";
      if(this.state.isQM){
        stateUpdate["roomCodeList"]=payload.rooms;
        nextState="RoomListScreen";
        // console.log(stateUpdate)
      }
      this.props.cb(stateUpdate,nextState);
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
      return (
        <Loading 
          text={"Logging in..."}
          socket={this.props.socket}
          time={5000}
          listenFor={'login'}
          onSuccess={(payload)=>this.handleLoginResponse(payload)}
          onFailure={()=>{this.setState({isWaiting:false, message: "Time Out"})}} 
          onCancel={()=>{this.setState({isWaiting:false, message: ""})}}
        />
      );
    }
    let secInput;
    let QMButtonClass;
    let userButtonClass;
    let error="";
    if(this.state.message){
      error=(
        <div className="alert alert-warning alert-dismissible"> {this.state.message} 
          <button type="button" className="close" data-dismiss="alert">&times;</button>
        </div>
      );
    }
    if(this.state.isQM){
      secInput=(
        <div className="form-group">
        <label> Password: 
        </label>
          
          <input type="password" className="form-control" onChange={(event)=>this.takeTextInput(event,"password")} />
        </div>
      );
      QMButtonClass="disabled btn btn-info";
      userButtonClass="btn btn-outline-info";
    }
    else{
      secInput="";
      userButtonClass="disabled btn btn-info";
      QMButtonClass="btn btn-outline-info";
    }
    return(
      <div className="row h-100">
        <div className="game-box my-auto col-sm-8 offset-sm-2">
          {error}
          <form onSubmit={(event)=>this.handleSubmit(event)}>
            <div className="form-group">
              <button 
                className={userButtonClass} 
                onClick={(e)=>{ this.setState({ isQM: false }); e.preventDefault() }}
              >
                User Login
              </button>
              <button 
                className={QMButtonClass} 
                onClick={(e)=>{ this.setState({ isQM: true }); e.preventDefault() }}
              > 
                QM Login 
              </button>
            </div> 
            <div className="form-group">
              <label>
                Username: 
              </label>

              <input type="text" className="form-control" onChange={(event)=>this.takeTextInput(event,"username")} />
            </div>
            {secInput}
            <div className="form-group">
              <label> 
                Email: 
              </label>
              <input type="text" className="form-control" onChange={(event)=>this.takeTextInput(event,"email")} />
            </div>
            <div className="form-group">
              <label>
                Phone Number: 
              </label>
              <input type="number" className="form-control" onChange={(event)=>this.takeTextInput(event,"phone")} />
            </div>
            <input type="submit" className="form-control" value="Submit" />
          </form>
        </div>
      </div>
    )
  }
}

export default Login