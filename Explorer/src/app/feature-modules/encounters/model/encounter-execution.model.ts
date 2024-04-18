export interface EncounterExecution {
    id: number,
    userId: number,
    encounterId: number,
    completionTime?: Date,
    isCompleted: boolean,
}