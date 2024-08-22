import { Component, OnInit } from '@angular/core';
import { BachelorEncounter } from '../model/bachelor-encounters.model';
import { BachelorEncounterServiceService } from '../bachelor-encounter-service.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-encounters-preview',
  templateUrl: './encounters-preview.component.html',
  styleUrls: ['./encounters-preview.component.css'],
})
export class EncountersPreviewComponent implements OnInit {
  allEncounters: BachelorEncounter[] = [];
  authorId: number;

  constructor(
    private encountersService: BachelorEncounterServiceService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authorId = user.id;
        this.encountersService.getEncounterByAuthorId(this.authorId).subscribe({
          next: (data: any) => {
            this.allEncounters = data.encounters;
            console.log(this.allEncounters);
          },
          error: (err) => {
            console.error('Error fetching encounters:', err);
          },
        });
      }
    });
  }

  navigateToCreation() {
    this.router.navigate(['/encounters-creation']);
  }
  navigateToEncounter(id: string) {
    this.router.navigate(['/single-encounter', id]);
  }
}
