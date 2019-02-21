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
    return (
      <div className="col-md-6">
      <Option
        value={this.props.options[i]}
        onClick={() => this.props.onClick(i)}
        isOn={this.props.isOn}
      />
      </div>
    );
  }

  render() {
    return (
      <div className="answers">
        <div className="row option-row">
          {this.renderOption(0)}
          {this.renderOption(1)}
        </div>
        <div className="row">
          {this.renderOption(2)}
          {this.renderOption(3)}
        </div>
      </div>
    );
  }
}
  
export default Answers