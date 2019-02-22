import React from "react";

class RoomSelect extends React.Component{
  /* 
  props:
  cb: What to do when room is selected 
  */
  constructor(props){
    super(props);
    this.state={
      roomcode: "",
    }
  }

  //Identical to login. Better way?
  takeTextInput(event, stateField){
    let stateUpdate={};
    stateUpdate[stateField]=event.target.value;
    this.setState(stateUpdate);
  }
  handleSubmit(event){
    event.preventDefault();
    this.props.cb({
      roomcode: this.state.roomcode,
    });
  }
  //

  render(){
    return(
      <div className="game-box col-sm-8 offset-sm-2">
        <form onSubmit={(event)=>this.handleSubmit(event)}>
          <label>
            RoomCode: 
            <input type="text" value={this.state.value} onChange={(event)=>this.takeTextInput(event,"roomcode")} />
          </label>
          <input type="submit" value="Submit" />
        </form> 
      </div>
    );
  }
}

export default RoomSelect;