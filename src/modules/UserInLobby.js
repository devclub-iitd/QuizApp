import React from "react";

function UserInLobby(props){
  /* 
  props:
  name: username to display (String)
  */
  return (
    <div className="user-in-lobby">
      {props.name}
    </div>
  );
}

export default UserInLobby

