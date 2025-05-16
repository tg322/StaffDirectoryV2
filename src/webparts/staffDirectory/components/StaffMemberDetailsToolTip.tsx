import * as React from 'react';
import { IUserProps } from './IStaffDirectoryProps';
import { Mail20Regular } from '@fluentui/react-icons';
import styles from './StaffDirectory.module.scss';
import { useEffect, useRef, useState } from 'react';

interface IStaffMemberDetailsToolTip{
    user:IUserProps;
    overflowTop:number | null;
    leftOffset:string;
    show:boolean;
}

function StaffMemberDetailsToolTip(props: IStaffMemberDetailsToolTip){
    const [topOffset, setTopOffset] = useState<string>('100%');

    const toolTipRef = useRef<HTMLDivElement>(null);

    const{
        user,
        leftOffset,
        overflowTop,
        show
    } = props

    useEffect(()=>{
        if(show){
            if(toolTipRef.current){
                if(overflowTop && overflowTop < toolTipRef.current.clientHeight){
                    setTopOffset(`-${toolTipRef.current.clientHeight}px`);
                }
            }
        }
    },[show])

    
    return(
        <div ref={toolTipRef} className={styles.StaffDirectoryDetailsToolTipWrapper} style={{left:`${leftOffset}`, top:`${topOffset}`, paddingTop:`${topOffset === '100%' ? '10px' : '0px'}`, paddingBottom:`${topOffset === '100%' ? '0px' : '10px'}`}}>
            <div className={styles.StaffDirectoryDetailsToolTipContainer}>
                <div className={styles.StaffDirectoryDetailsToolTipDetailsWrapper}>
                    <div className={styles.StaffDirectoryDetailsToolTipStaffImage}>

                    </div>
                    <div className={styles.StaffDirectoryDetailsToolTipDetailsContainer}>
                        <p>{user.name}</p>
                        <p>{user.jobTitle}</p>
                    </div>
                </div>
                <div className={styles.StaffDirectoryDetailsToolTipActionsContainer}>
                    <a className={styles.StaffDirectoryDetailsToolTipActionsEmail} href={`mailto:${user.email}`}>
                        <Mail20Regular style={{color:'#005670'}}/>
                        <p>Send Email</p>
                    </a>
                </div>
                <div className={styles.StaffDirectoryDetailsToolTipFurtherDetailsContainer}>
                    <p>{user.officeLocation}</p>
                    {user.businessPhones && user.businessPhones.map((phone:string, key)=> {
                        <p key={key}>{phone}</p>
                    })}
                    {user.departments && user.departments.map((singleDepartment:string, key)=> {
                        <p key={key}>{singleDepartment}</p>
                    })}
                </div>
            </div>
        </div>
    );

}

export default StaffMemberDetailsToolTip