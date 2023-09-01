import { IProcessReportResponse } from 'app/commons/services/dao/process-report-dao.service';
import { of } from 'rxjs';

export class ProcessReportDaoMock {
    public processReportRequest = () => of({} as IProcessReportResponse);
    
}