import React from "react";

function BackButton(props){
    return(
        <button 
            className="btn"
            onClick={(e)=>props.cb()}
        >
        &#10005;
        </button>
    );
}

export default BackButton;