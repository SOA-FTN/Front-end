export interface EncounterExecution {
    id: string,
    userId: number,
    encounterId: string,
    completionTime?: Date,
    isCompleted: boolean,
}