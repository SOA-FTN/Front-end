export enum Status {
    Accepted = 0,
    Onhold =  1,
    Rejected = 2
}

export interface TourPointRequest {
    id: number,
    authorId: number,
    tourPointId: number,
    status: Status
}