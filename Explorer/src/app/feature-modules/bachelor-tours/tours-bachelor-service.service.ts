import { Injectable } from '@angular/core';
import {
  BachelorShoppingCart,
  BachelorTourCreation,
  BachelorUpdateTour,
  CartItem,
} from './model/bachelor-tours';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ToursBachelorServiceService {
  constructor(private http: HttpClient) {}

  addBachelorTour(
    tour: BachelorTourCreation
  ): Observable<BachelorTourCreation> {
    console.log(tour);
    return this.http.post<BachelorTourCreation>(
      'http://localhost:8000/api/tours/createTours',
      tour
    );
  }

  updateBachelorTour(tour: BachelorUpdateTour): Observable<BachelorUpdateTour> {
    console.log(tour);
    return this.http.put<BachelorUpdateTour>(
      'http://localhost:8000/api/tours/updateTour',
      tour
    );
  }

  getPurchasedTours(userId: number): Observable<BachelorTourCreation[]> {
    return this.http
      .get<{ tours: BachelorTourCreation[] }>(
        'http://localhost:8000/api/tours/getPurchasedTours/' + userId
      )
      .pipe(
        map((response) => response.tours) // Pretpostavljam da se odgovor sastoji od objekta sa "tours" poljem
      );
  }

  getAuthorTours(userId: number): Observable<BachelorUpdateTour[]> {
    return this.http
      .get<{ tours: BachelorUpdateTour[] }>(
        'http://localhost:8000/api/tours/getAuthorTours/' + userId
      )
      .pipe(
        map((response) => response.tours) // Pretpostavljam da se odgovor sastoji od objekta sa "tours" poljem
      );
  }

  addOrRemoveTourFromCart(userId: number, cartItem: CartItem): Observable<any> {
    return this.http.put(
      `http://localhost:8000/api/stakeholders/addToCart?ID=${userId}`,
      cartItem
    );
  }

  getShoppingCart(userId: number): Observable<BachelorShoppingCart> {
    return this.http.get<BachelorShoppingCart>(
      `http://localhost:8000/api/stakeholders/getCart?ID=${userId}`
    );
  }

  buyTours(userId: number, tourIds: number[]): Observable<any> {
    const payload = {
      userId: userId,
      tourId: tourIds,
    };
    console.log(payload);
    return this.http.post('http://localhost:8000/api/tours/buyTours', payload);
  }

  clearCart(userId: number): Observable<any> {
    return this.http.delete(
      `http://localhost:8000/api/stakeholders/clearCart?ID=${userId}`
    );
  }
}
