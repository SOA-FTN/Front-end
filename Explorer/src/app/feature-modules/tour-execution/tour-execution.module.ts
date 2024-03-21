import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TourExecutionPositionComponent } from './tour-execution-position/tour-execution-position.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActiveTourComponent } from './active-tour/active-tour.component';
import { PurchasedToursComponent } from './purchased-tours/purchased-tours.component';
import { PurchasedTourDetailsComponent } from './purchased-tour-details/purchased-tour-details.component';
import { MyEndedToursComponent } from './my-ended-tours/my-ended-tours.component';
import { MyToursComponent } from './my-tours/my-tours.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    TourExecutionPositionComponent,
    ActiveTourComponent,
    PurchasedToursComponent,
    PurchasedTourDetailsComponent,
    MyEndedToursComponent,
    MyToursComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports:[
    TourExecutionPositionComponent,
    PurchasedToursComponent,
    PurchasedTourDetailsComponent,
    MyEndedToursComponent
  ]
})
export class TourExecutionModule { }
