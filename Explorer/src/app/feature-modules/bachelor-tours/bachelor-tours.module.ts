import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourCreationComponent } from './tour-creation/tour-creation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SingleTourViewComponent } from './single-tour-view/single-tour-view.component';
import { BachelorShoppingCartComponent } from './bachelor-shopping-cart/bachelor-shopping-cart.component';
import { TourPurchasedComponent } from './tour-purchased/tour-purchased.component';
import { ToursAuthorComponent } from './tours-author/tours-author.component';
import { SinglePurchasedTourComponent } from './single-purchased-tour/single-purchased-tour.component';
import { UpdateTourComponent } from './update-tour/update-tour.component';

@NgModule({
  declarations: [TourCreationComponent, SingleTourViewComponent, BachelorShoppingCartComponent, TourPurchasedComponent, ToursAuthorComponent, SinglePurchasedTourComponent, UpdateTourComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    BrowserModule,
    CanvasJSAngularChartsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    SharedModule,
  ],
})
export class BachelorToursModule {}
