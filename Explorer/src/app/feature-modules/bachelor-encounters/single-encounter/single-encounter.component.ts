import { Component, OnInit } from '@angular/core';
import { BachelorEncounter } from '../model/bachelor-encounters.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BachelorEncounterServiceService } from '../bachelor-encounter-service.service';
import { ToursBachelorServiceService } from '../../bachelor-tours/tours-bachelor-service.service';

@Component({
  selector: 'xp-single-encounter',
  templateUrl: './single-encounter.component.html',
  styleUrls: ['./single-encounter.component.css'],
})
export class SingleEncounterComponent implements OnInit {
  encounter: BachelorEncounter | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private encountersService: BachelorEncounterServiceService
  ) {}

  ngOnInit(): void {
    const encounterId = this.route.snapshot.paramMap.get('id');
    if (encounterId) {
      this.encountersService.getEncounterById(encounterId).subscribe({
        next: (data: BachelorEncounter) => {
          this.encounter = data;
          console.log(this.encounter);
        },
        error: (err) => {
          console.error('Error fetching encounter:', err);
        },
      });
    }
  }

  navigateToUpdate(): void {
    console.log(this.encounter);
    if (this.encounter) {
      this.router.navigate(['/update-encounter'], {
        state: { encounter: this.encounter },
      });
    }
  }

  deleteEncounter(): void {
    if (this.encounter) {
      this.encountersService.deleteEncounter(this.encounter.ID).subscribe({
        next: () => {
          this.router.navigate(['/encounters-preview']);
        },
        error: (err) => {
          console.error('Error deleting encounter:', err);
        },
      });
    }
  }
}
