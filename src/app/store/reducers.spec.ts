import { addFindingAction, deleteFindingAction, updateFindingAction } from './actions';
import { recordReducer } from './reducers';
import { initialRecordState, IRecordState } from './state';
import { FindingsType } from '../commons/services/dao/process-data-dao.service';

describe('recordReducer', () => {
    describe('updateFinding action', () => {
        it('updates finding with new content', () => {
            const INITIAL_STATE: IRecordState = {
                ...initialRecordState,
                reportFindings: {
                    ...initialRecordState.reportFindings,
                    findingsList: [
                        {
                            key: 'ud1',
                            content: 'OLD CONTENT',
                            findingsType: FindingsType.USER_DEFINED,
                        },
                    ],
                },
            };

            const EXPECTED_STATE: IRecordState = {
                ...initialRecordState,
                reportFindings: {
                    ...initialRecordState.reportFindings,
                    findingsList: [
                        {
                            key: 'ud1',
                            content: 'NEW CONTENT',
                            findingsType: FindingsType.USER_DEFINED
                        },
                    ],
                },
            };
	
	        const action = updateFindingAction({
		        serialNumber: '',
		        key: 'ud1',
		        content: 'NEW CONTENT'
	        });

            const reducerState = recordReducer(INITIAL_STATE, action);

            expect(reducerState).toEqual(EXPECTED_STATE);
        });

        it('Does not update finding when keys dont match', () => {
            const INITIAL_STATE: IRecordState = {
                ...initialRecordState,
                reportFindings: {
                    ...initialRecordState.reportFindings,
                    findingsList: [
                        {
                            key: 'ud1',
                            content: 'OLD CONTENT',
                            findingsType: FindingsType.USER_DEFINED,
                        },
                    ],
                },
            };

            const EXPECTED_STATE: IRecordState = INITIAL_STATE;
	
	        const action = updateFindingAction({
		        serialNumber: '',
		        key: 'TOTALLY MADE UP KEY',
		        content: 'NEW CONTENT'
	        });

            const reducerState = recordReducer(INITIAL_STATE, action);

            expect(reducerState).toEqual(EXPECTED_STATE);
        });
    });

    describe('addFinding action', () => {
        it('adds new finding', () => {
            const INITIAL_STATE: IRecordState = {
                ...initialRecordState,
                reportFindings: {
                    ...initialRecordState.reportFindings,
                    findingsList: [],
                },
            };

            const EXPECTED_STATE: IRecordState = {
                ...initialRecordState,
                reportFindings: {
                    ...initialRecordState.reportFindings,
                    findingsList: [
                        {
                            key: 'ud1',
                            content: 'CONTENT',
                            findingsType: FindingsType.USER_DEFINED,
                        },
                    ],
                },
            };

            const action = addFindingAction({
                content: 'CONTENT',
                key: 'ud1',
                serialNumber: '',
            });

            const reducerState = recordReducer(INITIAL_STATE, action);

            expect(reducerState).toEqual(EXPECTED_STATE);
        });

        it('updates finding when adding duplicate key', () => {
            const INITIAL_STATE: IRecordState = {
                ...initialRecordState,
                reportFindings: {
                    ...initialRecordState.reportFindings,
                    findingsList: [
                        {
                            key: 'ud1',
                            content: 'OLD CONTENT',
                            findingsType: FindingsType.USER_DEFINED,
                        },
                    ],
                },
            };

            const EXPECTED_STATE: IRecordState = {
                ...initialRecordState,
                reportFindings: {
                    ...initialRecordState.reportFindings,
                    findingsList: [
                        {
                            key: 'ud1',
                            content: 'NEW CONTENT',
                            findingsType: FindingsType.USER_DEFINED,
                        },
                    ],
                },
            };

            const action = addFindingAction({
                content: 'NEW CONTENT',
                key: 'ud1',
                serialNumber: '',
            });

            const reducerState = recordReducer(INITIAL_STATE, action);

            expect(reducerState).toEqual(EXPECTED_STATE);
        });
    });

    describe('deleteFinding action', () => {
        it('deletes user defined finding', () => {
            const INITIAL_STATE: IRecordState = {
                ...initialRecordState,
                reportFindings: {
                    ...initialRecordState.reportFindings,
                    findingsList: [
                        {
                            key: 'ud1',
                            findingsType: FindingsType.USER_DEFINED,
                        },
                    ],
                },
            };

            const EXPECTED_STATE: IRecordState = {
                ...initialRecordState,
                reportFindings: {
                    ...initialRecordState.reportFindings,
                    findingsList: [],
                },
            };
            const action = deleteFindingAction({ key: 'ud1' , serialNumber: ''});
            const reducerState = recordReducer(INITIAL_STATE, action);

            expect(reducerState).toEqual(EXPECTED_STATE);
        });
        it('does not delete generated finding', () => {
            const INITIAL_STATE: IRecordState = {
                ...initialRecordState,
                reportFindings: {
                    ...initialRecordState.reportFindings,
                    findingsList: [
                        {
                            key: 'svt',
                            findingsType: FindingsType.AUTO_GENERATED,
                        },
                    ],
                },
            };

            const EXPECTED_STATE: IRecordState = INITIAL_STATE;
            const action = deleteFindingAction({ key: 'svt', serialNumber: '' });
            const reducerState = recordReducer(INITIAL_STATE, action);

            expect(reducerState).toEqual(EXPECTED_STATE);
        });
    });
});
