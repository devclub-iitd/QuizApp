import React from "react"

class Login extends React.Component{
  /* 
  props:
  cb: What to do when logged in 
  */
  constructor(props){
    super(props);
    this.state={
      isQM: false,
      username: "",
      email: "",
      password: "",
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
    this.props.cb({
      isQM: this.state.isQM,
      username: this.state.username,
    });
  }
  render(){
    let secInput;
    let QMButtonClass;
    let userButtonClass;
    if(this.state.isQM){
      secInput=(
        <label> Password: 
          <input type="password" value={this.state.value} onChange={(event)=>this.takeTextInput(event,"password")} />
        </label>
      );
      QMButtonClass="btn-active btn";
      userButtonClass="btn";
    }
    else{
      secInput=(
        <label> Email: 
          <input type="text" value={this.state.value} onChange={(event)=>this.takeTextInput(event,"email")} />
        </label>
      );
      userButtonClass="btn-active btn";
      QMButtonClass="btn";
    }
    return(
      <div className="row">
        <div className="game-box col-sm-8 offset-sm-2">
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
              <input type="text" value={this.state.value} onChange={(event)=>this.takeTextInput(event,"username")} />
            </label>
            {secInput}
            <input type="submit" value="Submit" />
            {this.state.username}
          </form>
        </div>
      </div>
    )
  }
}

export default Login