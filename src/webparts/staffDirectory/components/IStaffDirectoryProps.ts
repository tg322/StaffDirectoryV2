
export interface IStaffDirectoryProps {
  context:any;
}

export interface userData{
  companyName:string;
  department:string;
  displayName:string;
  jobTitle:string;
  id:string;
  mail:string;
  businessPhones:string[];
  officeLocation:string;
}

export interface IUserProps{
  name: string;
  jobTitle: string;
  departments:string[];
  companyName:string;
  email:string;
  businessPhones:string[];
  officeLocation:string;
}

export class User implements IUserProps{
  constructor(
      public name:string,
      public jobTitle: string,
      public departments: string[],
      public companyName:string,
      public email:string,
      public businessPhones:string[],
      public officeLocation:string
  ) { }
}

export interface IPrepareUsersResponseProps{
  users:IUserProps[];
  departments:string[];
}

export interface BuildResponseType {
    success: boolean;
    message: string;
    data?: any; 
    error?: any; 
}