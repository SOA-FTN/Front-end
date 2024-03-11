import { Component, OnInit } from '@angular/core';
import { GuideReview } from '../model/guide-review.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-guide-review',
  templateUrl: './guide-review.component.html',
  styleUrls: ['./guide-review.component.css'],
  providers: [DatePipe]
})
export class GuideReviewComponent implements OnInit {
  guideReviews: GuideReview[] = [];
  selectedGuideReview: GuideReview;
  shouldEdit: boolean;
  shouldRenderGuideReviewForm: boolean = false;
  user: number;

  constructor(private service: MarketplaceService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user.id;
      console.log(this.user);
    });
    this.getGuideReviews();
  }

  getGuideReviews(): void {
    if(!this.shouldEdit) this.shouldRenderGuideReviewForm = false;

    this.service.getGuideReviews().subscribe({
      next: (result: PagedResults<GuideReview>) => {
        console.log(result);
        this.guideReviews = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onEditClicked(guideReview: GuideReview): void {
    this.shouldRenderGuideReviewForm = true;
    this.shouldEdit = true;
    this.selectedGuideReview = guideReview;
    console.log(this.selectedGuideReview);
  }

  onDeleteClicked(guideReview: GuideReview): void {
    this.selectedGuideReview = guideReview;
    this.shouldRenderGuideReviewForm = false;
    this.service.deleteGuideReview(this.selectedGuideReview).subscribe({
      next: (_) => {
        console.log("Deleted");
        this.getGuideReviews();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onAddClicked(): void {
    this.shouldRenderGuideReviewForm = true;
    this.shouldEdit = false;
  }
}
