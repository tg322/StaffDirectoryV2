import { SPHttpClient, SPHttpClientResponse, MSGraphClientV3 } from "@microsoft/sp-http";
import { BuildResponseType } from "../components/IStaffDirectoryProps";
import { responseBuilder } from "./BuildResponse";



export class DataHandler {

    private graphClient: MSGraphClientV3;
  
    constructor(graphClient: MSGraphClientV3) {
      this.graphClient = graphClient;
    }

    private responseBuilder = new responseBuilder();



    /**
     * Gets the FormDigestValue token for making API calls to SharePoint.
     *
     * @remarks
     * Use this method in conjunction with an API call.
     * 
     *
     * @param context - The webpart context.
     * @param urlLocation - The url origin of the API call.
     * @returns Array e.g {success:true, message: 'Data retrieved.', data:{data}}.
     *
     * @beta
     */

    async getFormDigestValue(context: any, urlLocation:string): Promise<BuildResponseType> {
        return new Promise(async (resolve, reject) => { // Ensure the executor function is async
            try {
                // Since context.spHttpClient.post is async, we need to await it
                const response = await context.spHttpClient.post(
                    `${urlLocation}/_api/contextinfo`,
                    SPHttpClient.configurations.v1,
                    {});
    
                // Parsing the JSON is also an async operation
                const responseJSON = await response.json();
    
                // Extracting the FormDigestValue
                const formDigestValue = responseJSON.FormDigestValue;
                    
                // Resolving the promise with a success response
                resolve(this.responseBuilder.buildResponse(true, 'Digest value retrieved successfully.', formDigestValue));
            } catch (error) {
                // Rejecting the promise with a failure response
                reject(this.responseBuilder.buildResponse(false, 'Digest value could not be retrieved.', '', error));
            }
        });
    }

    /**
     * Creates a folder in a specified location in SharePoint.
     *
     * @remarks
     * This method uses the SharePoint Graph API.
     * 
     *
     * @param context - The context of the webpart.
     * @param urlLocation - The location origin of the api call e.g https://mysharepoint.sharepoint.com
     * @param folderLocation - The location to place the folder e.g 'staff/Shared Documents'. 
     * @param folderName - The name of the folder to be created.
     *
     * @returns Array e.g {success:true, message: 'Data retrieved.', data:{data}}
     *
     * @beta
     */

    async createFolderInSP(context: any, urlLocation:string, folderLocation: string, folderName:string): Promise<BuildResponseType>{
        return new Promise(async (resolve, reject) => {
        const getFormDigestValueResponse = await this.getFormDigestValue(context, urlLocation);

        console.log("Sent Properties: ");
        console.log("url location",urlLocation);
        console.log("folderLocation",folderLocation);
        console.log("folderName",folderName);

        if(!getFormDigestValueResponse.success){
            return getFormDigestValueResponse
        }
            try{
                let serverRelativeUrl = `${urlLocation}/${folderLocation}/${folderName}`;
                let requestUrl = `${urlLocation}/_api/web/folders`;
                console.log("In Try Catch Block: ");
                console.log("serverRelative Url",serverRelativeUrl);
                console.log("requestUrl",requestUrl);

                const headers = {
                      'Accept': 'application/json;odata=nometadata',
                      'Content-type': 'application/json;odata=verbose',
                      'X-RequestDigest': getFormDigestValueResponse.data,
                      'odata-version': ''
                };
          
                const body = JSON.stringify({
                  '__metadata': { 'type': 'SP.Folder' },
                  'ServerRelativeUrl': serverRelativeUrl
              });
          
              const response = await fetch(requestUrl, {
                headers: headers,
                body: body,
                method: 'POST'
              });
          
              if(response.ok){
                resolve(this.responseBuilder.buildResponse(true, 'Folder created successfully.'));
              } else {
                resolve(this.responseBuilder.buildResponse(false, 'Error creating folder.',null,response.statusText));
              }
          
              }catch(error){
                reject(this.responseBuilder.buildResponse(false, 'Error creating folder.',null,error));
              }
        
      });
    }


    /**
     * Checks for the existance of a SharePoint folder in a specified location.
     *
     * @remarks
     * This method uses the SharePoint Graph API.
     * 
     *
     * @param context - The context of the webpart.
     * @param urlLocation - The location origin of the api call e.g https://mysharepoint.sharepoint.com.
     * @param folderLocation - The location to place the folder e.g '/staff/Shared Documents'. 
     * @param folderName - The name of the folder to be checked.
     *
     * @returns Array e.g {success:true, message: 'Data retrieved.', data:{data}}
     *
     * @beta
     */
    
    async checkFolderExistsInSP(context: any, urlLocation:string, folderLocation: string, folderName: string): Promise<BuildResponseType>{

        return new Promise(async (resolve, reject) => { 
        const formDigestValueResponse = await this.getFormDigestValue(context, urlLocation);
        
        if(formDigestValueResponse.success == true){
            try{
                const url = `${urlLocation}/_api/web/getfolderbyserverrelativeurl('/${folderLocation}/${folderName}')/Exists`;
            
                const headers = {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-Type': 'application/json;odata=verbose',
                    'odata-version': '',
                    'X-RequestDigest': formDigestValueResponse.data
                };
                
                context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
                    headers: headers
                })
                .then((response: SPHttpClientResponse) => {
                    if(response.ok) {
                    response.json().then((exists: boolean) => {
                        resolve(this.responseBuilder.buildResponse(true, 'Folder existance checked successfully.', exists));
                    });
                    }
                    else {
                        resolve(this.responseBuilder.buildResponse(false, 'Could not check the existance of folder.', '', response.statusText));
                    }
                });
            }catch(error){
                reject(this.responseBuilder.buildResponse(false, 'Could not check the existance of folder.', '', error));
            }
        }else{
            return formDigestValueResponse
        }
    });
}

    /**
     * Deletes a file from a specified location in SharePoint.
     *
     * @remarks
     * This method uses the SharePoint Graph API.
     * 
     *
     * @param context - The context of the webpart.
     * @param urlLocation - The location origin of the api call e.g https://mysharepoint.sharepoint.com.
     * @param folderLocation - The location to place the folder e.g 'staff/Shared Documents'. 
     * @param fileName - The name of the file to be deleted.
     *
     * @returns Array e.g {success:true, message: 'Data retrieved.', data:{data}}
     *
     * @beta
     */

    async deleteFileFromSP(context: any, urlLocation:string, folderLocation: string, fileName: string): Promise<BuildResponseType> {
        return new Promise(async (resolve, reject) => { 
        const formDigestValueResponse = await this.getFormDigestValue(context, urlLocation);

        if(!formDigestValueResponse.success){
            return formDigestValueResponse
        }

            try{
                const url = `${urlLocation}/_api/web/getfilebyserverrelativeurl('/${folderLocation}/${fileName}')`;
                const headers = {
                  'Accept': 'application/json;odata=nometadata',
                  'Content-Type': 'application/json;odata=verbose',
                  'odata-version': '',
                  'X-RequestDigest': formDigestValueResponse.data,
                  'IF-MATCH': '*',
                  'X-HTTP-Method': 'DELETE'
                };

                context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
                    headers: headers
                })
                .then((response: SPHttpClientResponse) => {
                  if(response.ok) {
                    resolve(this.responseBuilder.buildResponse(true, 'File deleted successfully.'));
                  }
                  else {
                    resolve(this.responseBuilder.buildResponse(false, 'File could not be deleted.', '', response.statusText));
                  }
                });
            }catch(error){
                reject(this.responseBuilder.buildResponse(false, 'File could not be deleted.', '', error));
            }

        
    });
}

    /**
     * Uploads a file to a specified location in SharePoint.
     *
     * @remarks
     * This method uses the SharePoint Graph API.
     * 
     *
     * @param context - The context of the webpart.
     * @param urlLocation - The location origin of the api call e.g https://mysharepoint.sharepoint.com.
     * @param file - The file to be uploaded. 
     * @param folderLocation - The location to place the folder e.g 'staff/Shared Documents'. 
     * @param overwrite - Overwrite any existing file with the same name (true/false).
     *
     * @returns Array e.g {success:true, message: 'Data retrieved.', data:{data}}
     *
     * @beta
     */

    async uploadFileToSP(context: any, urlLocation:string, file: File,  folderLocation: string, overwrite: boolean, fileName?:string): Promise<BuildResponseType> {
        //Get formDigestValue
        const formDigestValue = await this.getFormDigestValue(context, urlLocation);

        if(!formDigestValue.success){
            return formDigestValue
        }
        
        let reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = (event: any) => {
            let blob = new Blob([event.target.result], { type: file.type });
      
            // const url = `${context.pageContext.web.absoluteUrl}/_api/web/getfolderbyserverrelativeurl('/${folderLocation}')/files/add(overwrite=${overwrite}, url='${fileName && fileName? fileName : file.name}')?$expand=listItemAllFields`;
            
            const url = `${urlLocation}/_api/web/getfolderbyserverrelativeurl('/${folderLocation}')/files/add(overwrite=${overwrite}, url='${fileName && fileName? fileName : file.name}')?$expand=listItemAllFields`;

            const headers = {
              'Accept': 'application/json;odata=nometadata',
              'Content-Type': file.type,
              'odata-version': '',
              'X-RequestDigest': formDigestValue.data
            };
      
            context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
              body: blob,
              headers: headers
            })
            .then((response: SPHttpClientResponse) => {
              if(response.ok) {
                response.json().then((fileData: any) => {
                    resolve(this.responseBuilder.buildResponse(true, 'File successfully uploaded.', fileData));
                });
              }
              else {
                    reject(this.responseBuilder.buildResponse(false, 'File could not be uploaded.', null, response.statusText));
                }
                    reader.onerror = (error) => {
                    reject(this.responseBuilder.buildResponse(false, 'File could not be read.', null, error));
                    };
                });
            };
            reader.readAsArrayBuffer(file);
        });
    }


    /**
     * Gets users by organisation.
     *
     * @remarks
     * This method uses the SharePoint Graph API.
     * 
     * 
     * @param organisation - The organisation to fetch users from.
     *
     * @returns Array e.g {success:true, message: 'Data retrieved.', data:{data}}
     *
     * @beta
     */

    async getUsers(organisation: string): Promise<BuildResponseType>{
        return new Promise(async (resolve, reject) => {

            let query = `/users?$count=true&$filter=companyName eq '${organisation}' and accountEnabled eq true&$select=id,displayName,department,companyName,jobTitle,officeLocation,mail,businessPhones`;

            try {
                const response = await this.graphClient.api(query).version("v1.0").header("ConsistencyLevel", "eventual").get();
                resolve(this.responseBuilder.buildResponse(true, 'Users fetched successfully.', response.value));
            } catch (error) {
                reject(this.responseBuilder.buildResponse(false, 'Error fetching users.',null,error));
            }
        
      });
    }



    
}
