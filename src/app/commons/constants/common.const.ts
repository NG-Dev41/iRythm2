/**
 * QA date format from https://wiki.irhythmtech.org/pages/viewpage.action?spaceKey=TQA&title=Feature+references+and+definitions
 */

export const QA_DATE_FORMAT = 'MM/dd/yyyy hh:mm:ss a';

export const newTransferSuccess = `Queue Update: A new transferred record has been assigned to your On-Hold column.`;

export const EDIT_SESSION_GENERIC_ERROR = 'There Was A Problem Saving Session Edits: \n ';

export const MARK_ECTOPIC_BLANK_BEATS_WARNING = 'This operation involves a blanked beat. This action is not allowed.';

export const SELECTED_REGION_HIGHER_RATE_WARNING = 'The selected region is already at a higher rate. No beats can be added.';

export const SELECTED_REGION_CONTAINS_ARTIFACT_WARNING = 'This operation involves an artifacted beat. This action is not allowed.';

export const NOT_ENOUGH_SURROUNDING_BEATS = 'The selected portion of the rate bar has fewer than 4 unblanked rates preceding it and fewer than 4 unblanked rates following it. This operation is not allowed.';

export const SUBSET_OF_COUPLET_OR_TRIPLET_WARNING = 'This operation involves a subset of an existing couplet or triplet. This action is not allowed.';

export function reportApprovedMessage(serialNumber: string) {
    return `Report for ${serialNumber} has been successfully posted.`;
}

export function newReassignMessage(serialNumber: string) {
    return  `Queue Update: ${serialNumber} has been successfully reassigned.`;
}

