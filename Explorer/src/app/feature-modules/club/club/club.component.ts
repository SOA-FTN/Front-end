import { Component, OnInit } from '@angular/core';
import { Club } from '../model/club.model';
import { ClubService } from '../club.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import {GoogleAnalyticsService} from "../../../infrastructure/google-analytics/google-analytics.service";


@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit{

  club: Club[] = [];
  selectedClub: Club;
  shouldEdit: boolean;
  shouldRenderClubForm: boolean = false;
  shouldPutBorder: boolean = false;

  constructor( private tokenStorage: TokenStorage,
               private service: ClubService,
               private googleAnalytics: GoogleAnalyticsService) {}

  ngOnInit(): void {
    this.googleAnalytics.sendPageView(window.location.pathname);

    this.getClubs();
  }
  getClubs(): void {
    const userId = this.tokenStorage.getUserId();
    this.service.getClubsByOwner(userId).subscribe({
      next: (result: PagedResults<Club>) => {
        this.club = result.results;
      },
      error: () => {
      }
    })
  }

  onAddClicked(): void{
    this.shouldRenderClubForm = true;
    this.shouldEdit = false;
  }

  onEditClickedFromChild(value: Club): void {
    this.shouldRenderClubForm = true;
    this.shouldEdit = true;
    this.selectedClub = value;
  }

  ondDeleteClubClicked(value: Club): void{
    this.service.deleteClub(value).subscribe({
      next: (_) => {
        this.getClubs();
      }
    })
  }
}


