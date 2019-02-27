import React from "react";
import Option from "./Option";

class Answers extends React.Component {
  /* 
    props:
    options: array of options (String Array)
    onClick: onclick function for options (Takes integer index)
    isOn: whether timer is on (Boolean)
  */
  renderOption(i) {
    if(this.props.options){
      return (
        <div className="col-md-6 option-container">
        <Option
          value={this.props.options["option"+i]}
          onClick={() => this.props.onClick(i)}
          isOn={this.props.isOn}
        />
        </div>
      );
    }
    else{
      return "";
    }
  }

  render() {
    return (
      <div className="answers">
        <div className="row option-row">
          {this.renderOption(1)}
          {this.renderOption(2)}
        </div>
        <div className="row option-row">
          {this.renderOption(3)}
          {this.renderOption(4)}
        </div>
      </div>
    );
  }
}
  
export default Answers