import { EcgDaoNotifierMock } from "../notifier/ecg-dao-notifier-mock.service";

export class EcgDaoControllerMock {
    daoNotifier = new EcgDaoNotifierMock();
}