import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'StaffDirectoryWebPartStrings';
import StaffDirectoryRoot from './components/StaffDirectoryRoot';
import { IStaffDirectoryProps} from './components/IStaffDirectoryProps';

export interface IStaffDirectoryWebPartProps {
  context:any;
}

export default class StaffDirectoryWebPart extends BaseClientSideWebPart<IStaffDirectoryWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IStaffDirectoryProps> = React.createElement(
      StaffDirectoryRoot,{
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit() {
    
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
