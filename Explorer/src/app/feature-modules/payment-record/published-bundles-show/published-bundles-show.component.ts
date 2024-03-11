import { Component } from '@angular/core';
import { PaymentRecordService } from '../payment-record.service';
import { Bundle } from '../bundle.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import axios from 'axios';
import { CurrencyService } from 'src/app/currency.service';

@Component({
  selector: 'xp-published-bundles-show',
  templateUrl: './published-bundles-show.component.html',
  styleUrls: ['./published-bundles-show.component.css']
})
export class PublishedBundlesShowComponent {

  publishedBundles: Bundle[]=[];
  bundle : Bundle;
  loggedInUser:number;
  currency: string[] = ['USD', 'EUR', 'JPY', 'GBP', 'CNY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD', 'RSD', 'INR'];
  selectedCurrency: string = 'USD';
  previousSelectedCurrency: string;
  exchangeRate: number;
  shouldShowOriginal: boolean;


  constructor(private paymentRecordService: PaymentRecordService,private authService:AuthService, private currencyService: CurrencyService){
    this.getPublishedBundles()
    this.getLoggedInUser()
    this.shouldShowOriginal = true
    this.previousSelectedCurrency = 'USD'
  }
  

  getLoggedInUser(){
    this.authService.user$.subscribe(user=>{
      if(user){
        this.loggedInUser = user.id;
        console.log('Id ulogovanog: '+this.loggedInUser);
      }
    })
  }

  getPublishedBundles(){
    this.paymentRecordService.getPublishedBundles().subscribe({
      next:(response)=>{
        this.publishedBundles=response.results;
        console.log('Publishovani paketi', this.publishedBundles)
      },
      
    })
  }

  
  tourBundlePurchase(tourBundleId: number): void {   
    this.paymentRecordService.tourBundlePurchase(tourBundleId, this.loggedInUser).subscribe({

      next:(response)=>{
        console.log('Response', response)
      },
      error:(error)=>{
        console.log(error)
      }
    })
    
  }

  onCurrencyChange(newCurrency: string): void {
    this.selectedCurrency = newCurrency;
    console.log(this.previousSelectedCurrency + " u " + this.selectedCurrency)
    // Fetch the new exchange rate
    this.currencyService.getExchangeRate(this.selectedCurrency).subscribe(
      (exchangeRate: number) => {
        // Use the exchange rate here
        this.exchangeRate = exchangeRate;
        console.log(this.exchangeRate)
        // Set the flag to show the converted price
        this.shouldShowOriginal = false;
      },
      (error) => {
        // Handle errors if needed
        console.error('Error fetching exchange rate:', error);
      }
    );
    this.previousSelectedCurrency = this.selectedCurrency
  }

  convertedCurrency(originalPrice: number): string {
    const convertedPrice = originalPrice * this.exchangeRate;
    console.log(originalPrice)    // Format the converted price as needed
    return convertedPrice.toFixed(2);
  }
}

