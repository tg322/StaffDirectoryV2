import * as React from 'react';
import { IUserProps } from './IStaffDirectoryProps';
import StaffMemberDetailsContainer from './StaffMemberDetailsContainer';

interface IStaffCategoryProps{
    department:string;
    users:IUserProps[];
}

function StaffCategory(props:IStaffCategoryProps){
    const{
        department,
        users
    } = props

    return(
        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
            <div style={{display:'flex', padding:'10px 15px', borderRadius:'8px', backgroundColor:'#005670'}}>
                <h3 style={{margin:'0px', color:'white'}}>{department}</h3>
            </div>
            <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap', gap:'10px'}}>
                {users.map((singleUser, key) => {
                        return(
                            <StaffMemberDetailsContainer key={key} user={singleUser}/>
                    )
                    })
                }
            </div>
        </div>
    )
}

export default StaffCategory