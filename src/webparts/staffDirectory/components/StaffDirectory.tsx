import * as React from 'react';
import styles from './StaffDirectory.module.scss';
import type { IPrepareUsersResponseProps, IStaffDirectoryProps, IUserProps } from './IStaffDirectoryProps';
import StaffCategory from './StaffCategory';
import { useEffect, useState } from 'react';
import { PrepareData } from '../utils/PrepareData';

function StaffDirectory(props:IStaffDirectoryProps){

  const {
    context
  } = props;

  const[allUsers, setAllUsers] = useState<Array<IUserProps>>();
  const[allDepartments, setAllDepartments] = useState<Array<string>>();

  async function fetchUsersAndDepartments(){
    let prepareData = new PrepareData();
    try{
      let preparedUsersAndDepartmentsResponse = await prepareData.prepareUsersAndDepartments(context);
      console.log(preparedUsersAndDepartmentsResponse.data)
      let preparedUsersAndDepartmentsData:IPrepareUsersResponseProps = preparedUsersAndDepartmentsResponse.data;
      setAllUsers(preparedUsersAndDepartmentsData.users);
      setAllDepartments(preparedUsersAndDepartmentsData.departments);
    }catch(error){
      throw new Error(error)
    }
  }

  useEffect(()=>{
    fetchUsersAndDepartments();
  },[])

  return(
    <section className={`${styles.staffDirectory}`} id='staffDirectory'>
        {allDepartments && allUsers && allDepartments.map((singleDepartment, key) => {
          let filteredUsers = allUsers.filter((singleUser: IUserProps) => singleUser.departments.indexOf(singleDepartment)!== -1);
          return(<StaffCategory key={key} users={filteredUsers} department={singleDepartment}/>)
        })
        }
    </section>
  )
}

export default StaffDirectory
