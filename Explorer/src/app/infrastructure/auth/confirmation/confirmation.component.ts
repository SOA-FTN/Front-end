import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'xp-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit{
  confirmationMessage: string;

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    const confirmationToken = this.route.snapshot.queryParams['token'];
    const confirmationUrl = `user/confirm-account?token=${confirmationToken}`;

    this.authService.confirmRegistration(confirmationUrl).subscribe(
      result => {
        // Handle successful response
        this.confirmationMessage = 'Registration confirmed successfully.';
      },
      error => {
        // Handle error response
        if (error.status === 400) {
          this.confirmationMessage = 'Error: Unable to confirm registration.';
        } else {
          // Handle other error cases
          this.confirmationMessage = 'Error: Registration already confirmed.';
          console.error('Unexpected error:', error);
        }
      });
  }
}
