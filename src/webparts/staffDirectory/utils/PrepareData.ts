import { MSGraphClientV3 } from "@microsoft/sp-http";
import { BuildResponseType, IUserProps, User, userData } from "../components/IStaffDirectoryProps";
import { responseBuilder } from "./BuildResponse";
import { DataHandler } from "./Helpers";

export class PrepareData{

    private responseBuilder = new responseBuilder();

    async prepareUsersAndDepartments(context:any): Promise<BuildResponseType>{
        let preparedUsers:IUserProps[] = [];
        let preparedDepartments:string[] = [];
        let preparedUsersAndDepartmentsResponse = {};
    
        try {
            const client: MSGraphClientV3 = await context.msGraphClientFactory.getClient('3');
            const dataHandler = new DataHandler(client);
    
            const getUsersResponse = await dataHandler.getUsers('Bosco Catholic Education Trust');
            if(!getUsersResponse.success){
                return getUsersResponse;
            }
    
            try {
                let buildUsersResponse = await this.buildUsers(getUsersResponse.data);
                if(!buildUsersResponse.success){
                    return buildUsersResponse;
                }
    
                preparedUsers = [...buildUsersResponse.data];
    
                try {
                    let buildDepartmentsResponse = await this.buildDepartments(getUsersResponse.data);
                    if(!buildDepartmentsResponse.success){
                        return buildDepartmentsResponse;
                    }
                    preparedDepartments = [...buildDepartmentsResponse.data];
                } catch(error) {
                    return this.responseBuilder.buildResponse(false, 'Failed to build departments', error);
                }
    
            } catch(error) {
                return this.responseBuilder.buildResponse(false, 'Failed to build users', error);
            }   
    
            preparedUsersAndDepartmentsResponse = {users: preparedUsers, departments: preparedDepartments};
            return this.responseBuilder.buildResponse(true, 'Successfully built users and departments.', preparedUsersAndDepartmentsResponse);
        } catch(error) {
            return this.responseBuilder.buildResponse(false, 'Failed to get Graph client', error);
        }
    }
    

    async buildUsers(users:userData[]): Promise<BuildResponseType>{
        let usersArray:IUserProps[] = [];

        for (const key of Object.keys(users)){

            let singleUser = users[Number(key)];
            
            let finalUserDepartments:string[] = [];

            if(singleUser.department){

                let userDepartmentResponse = this.getDepartment(singleUser.department);

                if(Array.isArray(userDepartmentResponse)){

                    finalUserDepartments = [...userDepartmentResponse];
                    
                }else{

                    finalUserDepartments.push(userDepartmentResponse);

                }
            }else{

                finalUserDepartments.push('Unassigned');

            }

            usersArray.push(new User(singleUser.displayName, singleUser.jobTitle? singleUser.jobTitle : 'Unassigned', finalUserDepartments, singleUser.companyName, singleUser.mail, singleUser.businessPhones, singleUser.officeLocation));

        }

        return this.responseBuilder.buildResponse(true, 'users returned successfully', usersArray);
    }


    async buildDepartments(users:userData[]): Promise<BuildResponseType>{

        let departmentsArray:string[] = [];

        for (const key of Object.keys(users)){

            let singleUser = users[Number(key)];
            
            if(singleUser.department){

                let userDepartmentResponse = this.getDepartment(singleUser.department);

                if(Array.isArray(userDepartmentResponse)){
                    
                    departmentsArray = [...departmentsArray, ...userDepartmentResponse]
                    
                }else{
                    departmentsArray.push(userDepartmentResponse);
                }
            }
        }

        

        let uniqueDepartmentsArray = departmentsArray.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        return this.responseBuilder.buildResponse(true, 'departments returned successfully', uniqueDepartmentsArray);
    }

    getDepartment(userDepartment:string){
        if(userDepartment.indexOf(',') !== -1){
            let userDepartmentsArray = userDepartment.split(', ');
            return userDepartmentsArray
        }else{
            return userDepartment
        }
    }
}