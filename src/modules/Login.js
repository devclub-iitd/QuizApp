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
      email: this.state.email,
      phone: this.state.phone,
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
      this.props.cb({
        username: this.state.username,
      });
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
        />
      );
    }
    let secInput;
    let QMButtonClass;
    let userButtonClass;
    if(this.state.isQM){
      secInput=(
        <label> Password: 
          <input type="password" onChange={(event)=>this.takeTextInput(event,"password")} />
        </label>
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
      <div className="game-box col-sm-8 offset-sm-2">
        {this.state.message}
        <form onSubmit={(event)=>this.handleSubmit(event)}>
          <div>
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
          <label>
            Username: 
            <input type="text" onChange={(event)=>this.takeTextInput(event,"username")} />
          </label>
          <label> Email: 
          <input type="text" onChange={(event)=>this.takeTextInput(event,"email")} />
        </label>
        <label> Phone Number: 
          <input type="number" min="1000000000" max="9999999999" onChange={(event)=>this.takeTextInput(event,"phone")} />
        </label>
          {secInput}
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default Login