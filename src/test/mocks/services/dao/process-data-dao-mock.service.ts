import {IProcessDataRequest, IProcessDataResponse} from 'app/commons/services/dao/process-data-dao.service';
import { of } from "rxjs";

export class ProcessDataDaoMock {
    public processDataRequest = (payload: IProcessDataRequest) => of({} as IProcessDataResponse);
}
