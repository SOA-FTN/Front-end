import { Tour } from "../tour/model/tour.model";

export interface Bundle{
    id: number,
    name: string,
    price:number,
    tours: Tour[],
    status: string
}