import * as React from 'react';
import { IUserProps } from './IStaffDirectoryProps';
import { useEffect, useRef, useState } from 'react';
import StaffMemberDetailsToolTip from './StaffMemberDetailsToolTip';

interface IStaffMemberDetailsContainer{
    user:IUserProps;
}

function StaffMemberDetailsContainer(props:IStaffMemberDetailsContainer){
    const{
        user
    } = props

    const[showToolTip, setShowToolTip] = useState<boolean>(false);
    const[hoveringOnCard, setHoveringOnCard] = useState<boolean>(false);
    const[leftOffset, setLeftOffset] = useState<string>('0');
    const[overflowTop, setOverflowTop] = useState<number | null>(null);
    const detailsCardRef = useRef<HTMLDivElement>(null);

    const tooltipTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (hoveringOnCard) {
            tooltipTimeout.current = window.setTimeout(() => {
            setShowToolTip(true);
            }, 600);
        } else {
            if (tooltipTimeout.current !== null) {
                clearTimeout(tooltipTimeout.current);
                tooltipTimeout.current = null;
            }
            setShowToolTip(false);
        }
    }, [hoveringOnCard]);
    
    useEffect(() => {
        console.log(user);
        if(detailsCardRef.current){
            const detailsCardRect = detailsCardRef.current.getBoundingClientRect();
            const container = document.querySelector('#staffDirectory');
            if(container){
                const containerRect = container.getBoundingClientRect()
                const overflowLeft = containerRect.right - detailsCardRect.left;
                const overflowTopValue = containerRect.bottom - detailsCardRect.bottom;
                setOverflowTop(overflowTopValue);
                if(overflowLeft < 360){
                    const leftVal = 360 - overflowLeft;
                    setLeftOffset(`-${leftVal}px`);
                }
            }
        }
    }, [showToolTip]);

    return(
        <div ref={detailsCardRef} style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'white', border:'solid 1px #edebe9', boxSizing:'border-box', padding:'10px 15px', borderRadius:'8px', width:'250px', gap:'10px', position:'relative', boxShadow: '1px 1px 3px 0px rgba(224,224,224,1)'}} onMouseEnter={()=> setHoveringOnCard(true)} onMouseLeave={()=> setHoveringOnCard(false)}>
            <div style={{width:'40px', height:'40px', borderRadius:'200px', backgroundColor:'gray', maxWidth:'40px', maxHeight:'40px', display:'flex', flexShrink:'0'}}>

            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'3px', maxWidth:'170px'}}>
                <p style={{fontWeight:'700', margin:'0px', fontSize:'14px'}}>{user.name}</p>
                <p style={{fontSize:'12px', margin:'0px', textOverflow:'ellipsis', textWrap:'nowrap', overflow:'hidden'}}>{user.jobTitle}</p>
            </div>
            {showToolTip && <StaffMemberDetailsToolTip user={user} overflowTop={overflowTop} leftOffset={leftOffset} show={showToolTip}/>}
        </div>
    );
}
export default StaffMemberDetailsContainer