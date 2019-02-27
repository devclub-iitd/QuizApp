import React from "react";
import Loading from "./Loading";
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


// {/* <Editor
//   wrapperClassName="wrapper-class"
//   editorClassName="editor-class"
//   toolbarClassName="toolbar-class"
//   wrapperStyle={<wrapperStyleObject>}
//   editorStyle={<editorStyleObject>}
//   toolbarStyle={<toolbarStyleObject>}
// /> */}

class AddQuestion extends React.Component {
  /* props:
  roomcode: 
  socket
  cb */
  constructor(props){
    super(props);
    this.state={
      question:"",
      options:{
        option1:"",
        option2:"",
        option3:"",
        option4:"",
      },
      answer:-1,
      error:"",
      isWaiting: false,
    }
  }
  takeTextInput(event, stateField){
    let stateUpdate={};
    stateUpdate[stateField]=event.target.value;
    this.setState(stateUpdate);
  }
  updateOptions(e,optionString){
    let stateUpdate=this.state.options;
    stateUpdate[optionString]=e.target.value;
    this.setState(stateUpdate);
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.socket.emit('createquestion',{
      question: this.state.question,
      options: this.state.options,
      roomid: this.props.roomcode,
      answer: this.state.answer,
    });
    this.setState({
      isWaiting: true,
    });
  }
  handleCreateQuestionResponse(payload){
    if(payload.message==="Success"){
      this.props.cb({questionList:payload.questions});
    }
    else{
      this.setState({
        isWaiting:false,
        error:payload.message,
      })
    }
  }
  render(){
    if(this.state.isWaiting){
      return(
        <Loading
          text={"Creating Question..."}
          socket={this.props.socket}
          time={5000}
          listenFor={'createquestion'}
          onSuccess={(payload)=>this.handleCreateQuestionResponse(payload)}
          onFailure={()=>{this.setState({isWaiting:false, message: "Time Out"})}} 
          onCancel={()=>{this.setState({isWaiting:false, message: ""})}}
        />
      )
    }
    return(
      <div className="row h-100">
        <div className="game-box my-auto col-sm-8 offset-sm-2">
        <div className="alert alert-warning alert-dismissible"> New Question: 
          <button type="button" className="close" onClick={()=>this.props.back()}>Back</button></div>
          {this.state.error}
          <form onSubmit={(event)=>this.handleSubmit(event)}>
            <div className="form-group">
              <label>
                Question: 
              </label>

              <input type="text" value={this.state.question} className="form-control" onChange={(event)=>this.takeTextInput(event,"question")} />
            </div>
            <div className="form-group">
              <label> 
                Option 1: 
              </label>
              <input type="text" value={this.state.options.option1} className="form-control" onChange={(event)=>this.updateOptions(event,"option1")} />
            </div>
            <div className="form-group">
              <label> 
                Option 2: 
              </label>
              <input type="text" value={this.state.options.option2} className="form-control" onChange={(event)=>this.updateOptions(event,"option2")} />
            </div>
            <div className="form-group">
              <label> 
                Option 3: 
              </label>
              <input type="text" value={this.state.options.option3} className="form-control" onChange={(event)=>this.updateOptions(event,"option3")} />
            </div>
            <div className="form-group">
              <label> 
                Option 4: 
              </label>
              <input type="text" value={this.state.options.option4} className="form-control" onChange={(event)=>this.updateOptions(event,"option4")} />
            </div>
            <div className="form-group">
              <label> 
                Answer: 
              </label>
              <input type="number" min="1" max="4" value={this.state.answer} className="form-control" onChange={(event)=>this.takeTextInput(event,"answer")} />
            </div>
            <input type="submit" className="form-control" value="Submit" />
          </form>
        </div>
      </div>
    )
  }
}
export default AddQuestion