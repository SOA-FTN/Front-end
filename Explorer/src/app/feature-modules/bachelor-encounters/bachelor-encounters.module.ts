import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncountersPreviewComponent } from './encounters-preview/encounters-preview.component';

@NgModule({
  declarations: [EncountersPreviewComponent],
  imports: [CommonModule],
  exports: [EncountersPreviewComponent],
})
export class BachelorEncountersModule {}
