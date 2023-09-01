import { IEcgEditResponse } from 'app/modules/ecg/interfaces'
import { of } from 'rxjs'

export class EcgEditDaoMock {
    public edit = () => { of({} as IEcgEditResponse) }
}