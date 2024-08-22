import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ToursBachelorServiceService } from '../tours-bachelor-service.service';
import { BachelorShoppingCart, CartItem } from '../model/bachelor-tours';

@Component({
  selector: 'xp-bachelor-shopping-cart',
  templateUrl: './bachelor-shopping-cart.component.html',
  styleUrls: ['./bachelor-shopping-cart.component.css'],
})
export class BachelorShoppingCartComponent implements OnInit {
  shoppingCart: BachelorShoppingCart;
  cartItem: CartItem;
  userId: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tourService: ToursBachelorServiceService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.loadShoppingCart(user.id);
      }
    });
  }

  loadShoppingCart(userId: number): void {
    this.tourService.getShoppingCart(userId).subscribe((cart) => {
      this.shoppingCart = cart;
    });
  }

  removeFromCart(item: CartItem): void {
    const updatedItem: CartItem = { ...item, add_or_remove: false };
    this.tourService
      .addOrRemoveTourFromCart(this.shoppingCart.user_id, updatedItem)
      .subscribe(() => {
        this.loadShoppingCart(this.shoppingCart.user_id); // Ponovo učitaj korpu nakon ažuriranja
      });
  }

  checkout(): void {
    const tourIds = this.shoppingCart.cart_items.map((item) =>
      Number(item.tour_id)
    );

    this.tourService.buyTours(this.shoppingCart.user_id, tourIds).subscribe(
      (response) => {
        console.log('Purchase successful:', response);
        this.shoppingCart.cart_items = [];
        this.shoppingCart.total_price = 0;
        // Nakon uspešne kupovine, očisti korpu
        this.tourService.clearCart(this.userId).subscribe(
          () => {
            console.log('Shopping cart cleared successfully');
            // Možeš ovde dodati dodatnu logiku, poput navigacije na stranicu potvrde
          },
          (error) => {
            console.error('Failed to clear shopping cart:', error);
          }
        );
      },
      (error) => {
        console.error('Purchase failed:', error);
      }
    );
  }
}
