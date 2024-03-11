import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { RequestComponent } from './password-reset/request/request.component';
import { ResetComponent } from './password-reset/reset/reset.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ConfirmationComponent,
    RequestComponent,
    ResetComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    LoginComponent
  ]
})
export class AuthModule { }
