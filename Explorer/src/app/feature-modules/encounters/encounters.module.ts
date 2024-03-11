import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncountersPageComponent } from './encounters-page/encounters-page.component';
import { EncountersFormComponent } from './encounters-form/encounters-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { EncountersMapComponent } from './encounters-map/encounters-map.component';
import { ActivatedExecutionComponent } from './activated-execution/activated-execution.component';





@NgModule({
  declarations: [
    EncountersPageComponent,
    EncountersFormComponent,
    EncountersMapComponent,
    ActivatedExecutionComponent
   
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    SharedModule
    
  ],
  exports: [
    EncountersPageComponent
  ]
})
export class EncountersModule { }
