import React from "react";

class Timer extends React.Component{
  /* props:
    isOn: Whether to countdown or be greyed out (Boolean)
    endTime: Time at which to stop count (Date Object)
    totalTime: Size of timer in seconds (Integer)
    onTimeout: Function to call when timer runs out*/
  constructor(props){
    super(props);
    this.state={
      displayTime: props.endTime.getTime() - Date.now(),
      toDisplay: props.isOn,
    };
    if(this.state.displayTime<=0){
      this.state.toDisplay=false;
    }
    this.timerID=setInterval(()=>this.tick(),1000);
  }
  componentWillUnmount(){
    clearInterval(this.timerID);
  }

  tick(){
    if(this.state.toDisplay && this.props.isOn){
      this.setState({
        displayTime: this.props.endTime.getTime() - Date.now(),
      });
    }
    if((this.state.displayTime/1000|0) <= 0){
      this.setState({
        toDisplay:false,
      });
      this.props.onTimeout();
    }
  }
  render(){
    let timerClass;
    if(this.state.toDisplay && this.props.isOn){
      timerClass = "timer-on";
    } 
    else{
      timerClass = "timer-off";
    }
    return(
      <div className={timerClass}>  {(this.state.displayTime/1000|0)}
      <div className="progress">
        <div className="progress-bar" role="progressbar" style={{width: + ((this.state.displayTime/1000|0) / this.props.totalTime)*100+"%"}} >
       
        </div>
      </div>
      </div>
    )
  }
}

export default Timer