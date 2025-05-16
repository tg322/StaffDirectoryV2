import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import * as React from 'react';
import StaffDirectory from './StaffDirectory';
import { IStaffDirectoryProps } from './IStaffDirectoryProps';


function StaffDirectoryRoot(props:IStaffDirectoryProps){
  return(
    <FluentProvider theme={webLightTheme}>
      <StaffDirectory context={props.context}/>
    </FluentProvider>
  )
}

export default StaffDirectoryRoot
