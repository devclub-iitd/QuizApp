import React from "react";

class Loading extends React.Component{
  /* 
  props:
  text: Text to display while loading (String)
  socket: Socket object (Object)
  time: Time to wait in ms (Integer)
  listenFor: Event to listen for in socket (String)
  onSuccess: What to do when payload recieved (Takes Payload)
  onFailure: What to do on failure (No args)
  */
  constructor(props){
    super(props);
    this.timerID=setInterval(()=>this.tick(),this.props.time);
    this.props.socket.on(this.props.listenFor,(payload)=>this.props.onSuccess(payload));
  }
  tick(){
    this.props.socket.off(this.props.listenFor);
    this.props.onFailure();
  }
  componentWillUnmount(){
    clearInterval(this.timerID);
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