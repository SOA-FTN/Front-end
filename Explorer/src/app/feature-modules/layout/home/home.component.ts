import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Problem } from '../../marketplace/model/problem.model';
import { DatePipe } from '@angular/common';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { GoogleAnalyticsService } from "../../../infrastructure/google-analytics/google-analytics.service";

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(
    private notifications: NotificationsService,
    private router: Router,
    private probService: MarketplaceService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private googleAnalytics: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.googleAnalytics.sendPageView(window.location.pathname);

    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.showNotification();

    if (this.user.role == 'author') {
      this.notifyAboutDeadline();
    }
  }

  showNotification(): void {
    this.probService
      .isThereUnreadMessage(this.user.id || 0)
      .subscribe((idProblem: number) => {
        if (idProblem != 0) {
          const toast = this.notifications.info(
            'Nove poruke u cetu!',
            'Udjite da biste videli celu prepisku o problemu!',
            {
              timeOut: 2500,
              showProgressBar: true,
              clickToClose: true,
            }
          );

          toast.click?.subscribe(() => {
            this.router.navigate(['problems']);
          });
        }
      });
  }

  notifyAboutDeadline(): void {
    this.probService.getUnsolvedProblems().subscribe({
      next: (result: PagedResults<Problem>) => {
        if (result.totalCount != 0) {
          this.probService.getProblemWithClosestDeadline(this.user.id).subscribe({
            next: (problem: Problem) => {
              const toast = this.notifications.error('Rok: ' + this.datePipe.transform(problem.deadline, 'shortDate') + ' je najblize!', 'Problemu: "' + problem.description + '" najskorije istice rok, pogledajte sve detaljnije', {
              timeOut: 3500,
              showProgressBar: true,
              clickToClose: true
        });
        toast.click?.subscribe(() => {
          this.router.navigate(['problems']);
        })
      }
    });
   }
  }
  });
  }
}
