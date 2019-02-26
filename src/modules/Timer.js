import React from "react";

class Timer extends React.Component{
  /*
  props:
  isOn: Whether to countdown or be greyed out (Boolean)
  endTime: Time at which to stop count (Date Object)
  totalTime: Size of timer in seconds (Integer)
  onTimeout: Function to call when timer runs out (No args)
    */
  constructor(props){
    super(props);
    this.state={
      displayTime: props.endTime.getTime() - Date.now(),
    };
    if(this.state.displayTime<=0){
      this.props.onTimeout();
    }
    this.timerID=setInterval(()=>this.tick(),100);
  }
  componentWillUnmount(){
    clearInterval(this.timerID);
  }

  tick(){
    if(this.props.isOn){
      this.setState({
        displayTime: this.props.endTime.getTime() - Date.now(),
      });
    }
    if((this.state.displayTime) <= 0){
      this.props.onTimeout();
    }
  }
  render(){
    let timerClass;
    if(this.props.isOn){
      timerClass = "timer-on";
    } 
    else{
      timerClass = "timer-off";
    }
    let displayValue;
    let displayWidthPercent;
    if(this.props.isOn){
      displayWidthPercent =(((this.state.displayTime-300) / (10*this.props.totalTime)));
    }
    else{
      displayWidthPercent = 0;
    }
    if(this.state.displayTime>=0){
      displayValue=(((this.state.displayTime) /1000|0) + 1);
    }
    else{
      displayValue=0;
    }
    return(
      <div className={timerClass}>  {displayValue} {/* and {displayWidthPercent} and {this.state.displayTime} */}
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{width: + displayWidthPercent+"%"}} >
          </div>
        </div>
      </div>
    )
  }
}

export default Timer