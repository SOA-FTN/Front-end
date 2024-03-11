export interface Coupon{
    id: number,
    code: string,
    discount: number,
    expirationDate: Date,
    tourId: number,
    touristId: number,
    authorId: number
}