import { Component, OnInit } from '@angular/core';
import { Account } from '../model/account.model';
import { AdministrationService } from '../administration.service';
import { GoogleAnalyticsService } from '../../../infrastructure/google-analytics/google-analytics.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { AccountConfirmationDialogComponent } from './account-confirmation-dialog/account-confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  accounts: Account[] = [];
  selectedAccount: Account;

  constructor(
    private service: AdministrationService,
    private googleAnalytics: GoogleAnalyticsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.googleAnalytics.sendPageView(window.location.pathname);

    this.getAccounts();
  }

  getAccounts(): void {
    this.service.getAccounts().subscribe({
      next: (result: Account[]) => {
        this.accounts = result;
      },
      error: () => {},
    });
  }

  changeAccountStatus(account: Account): void {
    this.selectedAccount = account;

    const dialogRef = this.dialog.open(AccountConfirmationDialogComponent, {
      data: {
        message: `Are you sure you want to ${
          account.isActive ? 'block' : 'unblock'
        } this person?`,
        buttonText: {
          ok: account.isActive ? 'Block' : 'Unblock',
          cancel: 'Cancel',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service.changeAccountStatus(this.selectedAccount).subscribe({
          next: () => {
            this.getAccounts();

            // Show a toast notification
            this.snackBar.open(
              `You have successfully ${
                account.isActive ? 'blocked' : 'unblocked'
              } this user.`,
              'Close',
              {
                duration: 3000,
              }
            );
          },
          error: () => {
            // Handle error case if necessary
          },
        });
      }
    });
  }

  getRoleName(role: string): string {
    switch (role) {
      case 'administrator':
        return 'Administrator';
      case 'tourist':
        return 'Turista';
      case 'author':
        return 'Autor';
      default:
        return 'Unknown';
    }
  }
}
