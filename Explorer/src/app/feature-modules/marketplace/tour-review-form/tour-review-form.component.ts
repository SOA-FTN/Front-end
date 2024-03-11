import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TourReview } from '../model/tourReview.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MarketplaceService } from '../marketplace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';

@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css'],
})
export class TourReviewFormComponent implements OnInit {
  tourId: number;

  constructor(
    private fb: FormBuilder,
    private tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private service: MarketplaceService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tourId = params['id'];
    });
  }

  selectedMapsRating: number = 0;
  selectedContentRating: number = 0;
  selectedPriceRating: number = 0;

  setRateForMaps(rating: number): void {
    this.selectedMapsRating = rating;
  }

  setRateForContent(rating: number): void {
    this.selectedContentRating = rating;
  }

  setRateForPrice(rating: number): void {
    this.selectedPriceRating = rating;
  }

  TourReviewForm = new FormGroup({
    wouldRecommend: new FormControl(false),
    positiveExperience: new FormControl(false),
    negativeExperience: new FormControl(false),
    experience: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
  });

  addReview() {
    const userId = this.tokenStorage.getUserId();

    const review: TourReview = {
      grade:
        (this.selectedContentRating +
          this.selectedMapsRating +
          this.selectedPriceRating) /
        3,
      comment: this.TourReviewForm.value.comment || '',
      attendanceDate: new Date(),
      reviewDate: new Date(),
      images: [''],
      touristId: userId || 0,
      tourId: this.tourId,
    };

    this.service.createReview(review).subscribe({
      next: () => {
        this.TourReviewForm.reset();
        this.selectedContentRating = 0;
        this.selectedMapsRating = 0;
        this.selectedPriceRating = 0;
        console.log(review);
      },
    });
  }
}
