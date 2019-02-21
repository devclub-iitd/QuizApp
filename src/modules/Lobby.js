import React from "react";
import UserInLobby from "./UserInLobby"
class Lobby extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userList: ["user1","user2","user3","user4"],
      status: "Waiting For QM",
      startTime: new Date(),
    };
    this.state.startTime.setTime(this.state.startTime.getTime()+1000000); //temp
  }
  // renderUser(i){
  //   return (
  //     <UserInLobby
  //       name={this.state.userList[i]}
  //     />
  //   );
  // }
  render(){
    let userDisplayList=[];
    this.state.userList.forEach(element => {
      userDisplayList.push(
        <UserInLobby
          name={element}
        />
      )
    });
    return(
      <div className="lobby">
        {userDisplayList}
      </div>
    );
  }
}

export default Lobby