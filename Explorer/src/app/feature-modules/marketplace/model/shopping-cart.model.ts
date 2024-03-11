export interface ShoppingCart {
    id?: number;
    touristId: number;
    orderItems: OrderItem[];
    total: number;
  }

  export interface OrderItem {
    tourName: string;
    price: number;
    idTour: number;
  }