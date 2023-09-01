import { ActionReducer, ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { addFindingAction, deleteFindingAction, setFindingsAction, updateFindingAction } from './actions';
import { IAppState, initialRecordState } from './state';
import { FindingsType, IFinding } from '../commons/services/dao/process-data-dao.service';

export const recordReducer = createReducer(
    initialRecordState,
    on(setFindingsAction, (state, action) => ({
        serialNumber: state.serialNumber,
        reportFindings: {
            rawServerResponse: action.findings.rawServerResponse,
            findingsList: action.findings.findingsList,
            keyValueMap: action.findings.keyValueMap,
            serialNumber: action.findings.serialNumber,
        },
    })),
    on(addFindingAction, (state, { serialNumber, content, key }) => {
        const newFinding: IFinding = {
            content,
            findingsType: FindingsType.USER_DEFINED,
            key
        };

        const newFindingsList = [...state.reportFindings.findingsList];
        const indexOfNewFindingKey = newFindingsList.map((finding) => finding.key).indexOf(key);
        if (indexOfNewFindingKey !== -1) {
            newFindingsList.splice(indexOfNewFindingKey, 1);
        }
        newFindingsList.push(newFinding);

        const newState = {
            serialNumber: state.serialNumber,
            reportFindings: {
                rawServerResponse: state.reportFindings.rawServerResponse,
                findingsList: newFindingsList,
                keyValueMap: state.reportFindings.keyValueMap,
                serialNumber: state.reportFindings.serialNumber,
            },
        };

        return newState;
    }),
    on(updateFindingAction, (state, { key, content, serialNumber }) => {
        const newFindingsList: Array<IFinding> = structuredClone(state.reportFindings.findingsList) as Array<IFinding>;
        const indexToUpdate = newFindingsList.findIndex((finding: IFinding) => finding.key === key);
        if (indexToUpdate === -1) {
            return state;
        }
        const newFinding: IFinding = {
            ...newFindingsList[indexToUpdate],
            content,
        };

        newFindingsList.splice(indexToUpdate, 1, newFinding);

        const newState = {
            serialNumber: state.serialNumber,
            reportFindings: {
                rawServerResponse: state.reportFindings.rawServerResponse,
                findingsList: newFindingsList,
                keyValueMap: state.reportFindings.keyValueMap,
                serialNumber: state.reportFindings.serialNumber,
            },
        };
        return newState;
    }),
    on(deleteFindingAction, (state, { key }) => {
        // Return the existing state if we don't find the key in the findings list
        if (
            [...state.reportFindings.findingsList].find((finding: IFinding) => finding.key == key)?.findingsType !==
            FindingsType.USER_DEFINED
        ) {
            return { ...state };
        }

        // Create new findings list with everything, but the deleted finding
        const newFindingsList = [...state.reportFindings.findingsList].filter((finding) => finding.key !== key);
        return {
            ...state,
            reportFindings: {
                ...state.reportFindings,
                findingsList: newFindingsList,
            },
        };
    })
);

export const reducers: ActionReducerMap<IAppState> = {
    recordEntity: recordReducer,
};

export const metaReducers: MetaReducer<IAppState>[] = !environment.production ? [] : [];
