import { Component } from '@angular/core';
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'xp-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar:MatSnackBar
  ) {}

  requestForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  request() {
    this.requestForm.controls['email'].updateValueAndValidity();

    if (this.requestForm.valid) {
      const request = this.requestForm.value.email || "";

      this.authService.requestPasswordReset(request).subscribe({
        next: (response) => {

          console.log('Response:', response);

          this.openSnackBar("Check your email for the reset link.");
          this.router.navigate(['/home']);
        },
        error: (error) => {

          if (error.status === 200) {
            this.openSnackBar("Check your email for the reset link.");
            this.router.navigate(['/home']);
          }
          else {
            this.openSnackBar('An error occurred.');
          }
        }
      });
    }
    else {
      this.openSnackBar('Invalid email.');
    }
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 30000,
    });
  }
}
