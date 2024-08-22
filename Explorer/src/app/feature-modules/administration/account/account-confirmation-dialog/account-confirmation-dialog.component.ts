import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'xp-account-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.message }}</h2>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onConfirmClick()" color="warn">
        {{ data.buttonText.ok }}
      </button>
      <button mat-button mat-dialog-close>{{ data.buttonText.cancel }}</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./account-confirmation-dialog.component.css'],
})
export class AccountConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AccountConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
