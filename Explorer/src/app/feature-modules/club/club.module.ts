import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubComponent } from './club/club.component';
import { ClubFormComponent } from './club-form/club-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatSelectModule } from '@angular/material/select';
import { ClubCardComponent } from './club-card/club-card.component';



@NgModule({
  declarations: [
    ClubComponent,
    ClubFormComponent,
    ClubCardComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule

  ],
  exports: [
    ClubComponent
  ]
})
export class ClubModule { }
