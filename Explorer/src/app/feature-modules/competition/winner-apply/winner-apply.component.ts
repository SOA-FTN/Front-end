import { Component, OnInit } from '@angular/core';
import { CompetitionApply } from '../model/competitionApply.model';
import { CompetitionServiceService } from '../competition-service.service';
import { AdministrationService } from '../../administration/administration.service';
import { ActivatedRoute } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Profile } from '../../administration/model/profile.model';

interface ExtendedCompetitionApply extends CompetitionApply {
  userName?: string;
  userLastName?: string;
}

@Component({
  selector: 'xp-winner-apply',
  templateUrl: './winner-apply.component.html',
  styleUrls: ['./winner-apply.component.css']
})
export class WinnerApplyComponent implements OnInit {

  competitionId: number | 0;
  competitionApplies: ExtendedCompetitionApply[] = [];

  constructor(private route: ActivatedRoute, private competitionService: CompetitionServiceService, private userService: AdministrationService){}

  ngOnInit(): void {
    this.competitionId = +this.route.snapshot.paramMap.get('id')!;
    this.getWinner();
  }

  getWinner() : void {
    this.competitionService.getWinnersByComp(this.competitionId).subscribe({
      next: (applies: PagedResults<ExtendedCompetitionApply>) => {
        this.competitionApplies = applies.results;
        this.competitionApplies.forEach(apply => {
            this.userService.getProfile(apply.userId).subscribe({
              next: (data: Profile) => {
                apply.userName = data.name;
                apply.userLastName = data.surname;
              }
            })
        });
      }
    })
  }
}
