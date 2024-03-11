import { Injectable } from '@angular/core';

declare var gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  public sendPageView(url: string) {
    gtag('config', 'G-KZXTM9407F', {
      'page_path': url
    });
  }

  public sendEvent(eventName: string, eventCategory: string, eventAction: string, eventLabel: string, eventValue: number) {
    gtag('event', eventName, {
      event_category: eventCategory,
      event_action: eventAction,
      event_label: eventLabel,
      value: eventValue
    });
  }
}
