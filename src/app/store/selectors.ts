import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAppState, IRecordState, IFindingsState } from './state';

export const selectRecordState = createFeatureSelector<IRecordState>('recordEntity');

export const selectFindings = createSelector(
    selectRecordState,
    (state: IRecordState) => state?.reportFindings?.findingsList
);

export const selectPreviousFindings = createSelector(selectRecordState, (state: IRecordState) => state?.reportFindings);

export const selectKeyValueMap = createSelector(selectRecordState, (state: IRecordState) => state?.reportFindings?.keyValueMap)
