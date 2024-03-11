import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiKey = '5a85871d6fa8461cc76aadff';
  private apiUrl = 'https://v6.exchangerate-api.com/v6/';

  constructor(private httpClient: HttpClient) {}

  getExchangeRate(targetCurrency: string): Observable<number> {
    const url = this.apiUrl + this.apiKey + "/latest/USD" 
    console.log(url)
    return this.httpClient.get<any>(url).pipe(
      map((response) => {
        console.log(response.conversion_rates)
        console.log(response.conversion_rates[targetCurrency] )
        // Check if 'rates' property is defined and has the 'targetCurrency'
        if (response && response.conversion_rates && response.conversion_rates[targetCurrency] !== undefined) {
          return response.conversion_rates[targetCurrency];
        } else {
          throw new Error(`Exchange rate for ${targetCurrency} not found in response.`);
        }
      }),
      catchError((error) => {
        console.error('Error fetching exchange rates:', error.message);
        throw error;
      })
    );
  }
}
