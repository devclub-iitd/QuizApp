import React from "react";

class Leaderboard extends React.Component{
    /* props:
    username
    result 
    isEmbedded*/
    render(){
        let rowlist=[];
        let header="";
        let label="";
        if(!this.props.isEmbedded){
            label=(
                <div className="alert alert-warning alert-dismissible"> Leaderboard: 
                    <button type="button" className="close" onClick={()=>this.props.back()}>Back</button>          
                </div>
            );
        }
        if(this.props.result){
            let i=1;
            this.props.result.forEach(element => {
                if(element){
                    let tr_class="";
                    if (element.username===this.props.username){
                        tr_class="table-warning";
                    }
                    rowlist.push(
                        <tr className={tr_class}>
                            <td>{i}</td>
                            <td>{element.username}</td>
                            <td>{element.total}</td>                            
                        </tr>
                    )
                    i++;
                }
            });
            header=(
                <thead className="thead-dark">
                <tr>
                  <th>Position</th>
                  <th>Username</th>
                  <th>Total</th>
                </tr>
              </thead>
            )
        }
        return(
            <div>
                {label}
                <table className="table">
                    {header}
                <tbody>
                    {rowlist}
                </tbody>
                </table>
            </div>
        );
    }

}

export default Leaderboard;

// table class="table">
//     <thead class="thead-dark">
//       <tr>
//         <th>Firstname</th>
//         <th>Lastname</th>
//         <th>Email</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td>John</td>
//         <td>Doe</td>
//         <td>john@example.com</td>
//       </tr>
//       <tr>
//         <td>Mary</td>
//         <td>Moe</td>
//         <td>mary@example.com</td>
//       </tr>
//       <tr>
//         <td>July</td>
//         <td>Dooley</td>
//         <td>july@example.com</td>
//       </tr>
//     </tbody>
//   </table>