import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'xp-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  showForm: boolean = false;

  token: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar:MatSnackBar
  ) {}

  resetForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];

    if (this.token != null) {
      this.showForm = true;
    }
  }

  reset() {
    const request = this.resetForm.value.password || "";
    const equalPass = this.resetForm.value.password == this.resetForm.value.confirmPassword;

    if (this.resetForm.valid && equalPass) {
      this.authService.resetPassword(this.token, request).subscribe({
        next: () => {
          this.openSnackBar('Password reset successfully.');
          this.router.navigate(['/login']);
        },
        error: (error) => {

          if (error.status === 200) {
            this.openSnackBar('Password reset successfully.');
            this.router.navigate(['/login']);
          }
          else {
            this.openSnackBar('An error occurred.');
          }
        }
      });
    }
    else if(!equalPass) {
      this.openSnackBar('Passwords aren\'t matching.');
    }
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 30000,
    });
  }
}
