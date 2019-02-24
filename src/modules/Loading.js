import React from "react";

class Loading extends React.Component{
  /* 
  props:
  text:
  socket:
  time:
  listenFor:
  onSuccess:
  onFailure: 
  */
  constructor(props){
    super(props);
    setTimeout(()=>this.tick(),this.props.time);
    this.props.socket.on(this.props.listenFor,(payload)=>this.props.onSuccess(payload));
  }
  tick(){
    this.props.socket.off(this.props.listenFor);
    this.props.onFailure();
  }
  render(){
    return (
      <div className="game-box col-sm-8 offset-sm-2">
        {this.props.text}
      </div>
    )
  }
}

export default Loading