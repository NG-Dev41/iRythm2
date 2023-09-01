import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IProcessDataRequest, IProcessDataResponse, ProcessDataDao } from 'app/commons/services/dao/process-data-dao.service';
import { EndpointUrl } from 'app/commons/constants/endpoint-url.const';

export interface INotesConfig {
    serialNumber: string;
    newNoteNumber: number;
}

@Injectable()
export class NotesService {
  constructor(
      private httpClient: HttpClient,
      private endpoint: EndpointUrl,
      private processDataDao: ProcessDataDao
  ) { }

    /**
     * getNotes and createNote are calling the same endpoint with different payloads
     * the DataRequestType differentiates between a 'READ' or 'CREATE' POST call
     */
  public makeNotesRequest(params: IProcessDataRequest): Observable<IProcessDataResponse> {
      return this.processDataDao.processDataRequest(params);
  }
}

// todo: mock obj can be used in test file?
// Yes but should be extracted into it's on file

export const mockReturnDataProcess: IProcessDataResponse = {
    serverInfo: {
        version: '3',
        buildNumber: 123
    },
    errorInfo: {
        hasError: false,
        errorRecordList: null
    },
    noteList: [
        {
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnaaliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            user: `patchtech@irhythmtech.com`,
            createdDate: new Date(1649912400000)
        },
        {
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnaaliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            user: 'secondtech@irhythmtech.com',
            createdDate: new Date(1646632800000)
        },
        {
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnaaliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            user: 'firsttech@irhythmtech.com',
            createdDate: new Date(1643436000000)
        }
    ]
};
