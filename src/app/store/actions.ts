import { createAction, props } from '@ngrx/store';
import { IFindingsState } from './state';

export const setFindingsAction = createAction('[Findings] Set Findings', props<{ findings: IFindingsState }>());

export const retrieveFindingsAction = createAction(
    '[Findings] Retrieve Findings',
    props<{ serialNumber: string }>()
);

export const addFindingAction = createAction(
	'[Findings] Add Finding',
	props<{content: string, key: string, serialNumber: string}>()
);

export const updateFindingAction = createAction(
	'[Findings] Update Finding',
	props<{content: string, key: string, serialNumber: string}>()
);

export const deleteFindingAction = createAction(
	'[Findings] Delete Finding',
	props<{key: string, serialNumber: string}>()
)

