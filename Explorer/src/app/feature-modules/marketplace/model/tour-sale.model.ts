export interface TourSale {
    id?: number;
    authorId: number;
    startDate: Date;
    endDate: Date;
    salePercentage: number;
    tourIds: number[];
}