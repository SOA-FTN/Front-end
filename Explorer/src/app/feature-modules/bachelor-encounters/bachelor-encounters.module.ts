import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncountersPreviewComponent } from './encounters-preview/encounters-preview.component';
import { EncountersCreationComponent } from './encounters-creation/encounters-creation.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SingleEncounterComponent } from './single-encounter/single-encounter.component';
import { UpdateEncounterComponent } from './update-encounter/update-encounter.component';
@NgModule({
  declarations: [
    EncountersPreviewComponent,
    EncountersCreationComponent,
    SingleEncounterComponent,
    UpdateEncounterComponent,
  ],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  exports: [EncountersPreviewComponent],
})
export class BachelorEncountersModule {}
