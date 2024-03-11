import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { TourReview } from '../model/tourReview.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-update-review',
  templateUrl: './update-review.component.html',
  styleUrls: ['./update-review.component.css'],
})
export class UpdateReviewComponent implements OnChanges {
  @Output() addedObject = new EventEmitter<null>();

  showComponent: boolean = true;
  id: number | undefined;
  @Input() reviewForUpdate: TourReview;

  url: string;
  inputForm = new FormGroup({
    grade: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
    images: new FormControl('', [Validators.required]),
  });
  img: string;
  tourReview: TourReview = {
    id: 0,
    grade: 0,
    comment: '',
    attendanceDate: new Date(),
    reviewDate: new Date(),
    images: [''],
    touristId: 10,
    tourId: 0,
  };

  loggedInUser: User = {
    id: 0,
    username: '',
    role: '',
  };

  ngOnChanges(changes: SimpleChanges) {
    console.log('Primlljeni objekat', this.reviewForUpdate.id);
    this.id = this.reviewForUpdate.id;
    this.inputForm.patchValue({
      grade: this.reviewForUpdate.grade.toString(),
      comment: this.reviewForUpdate.comment,
    });

    console.log(this.inputForm.value.comment);
  }
  constructor(
    private authService: AuthService,
    private tourReviewService: MarketplaceService
  ) {
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.loggedInUser.id = user.id;
        this.loggedInUser.username = user.username;
        this.loggedInUser.role = user.role;
        console.log('Ulogovani korisnik', this.loggedInUser);
      }
    });
  }

  onEdit() {
    this.reviewForUpdate.id = this.id;
    console.log('Id na kraju', this.reviewForUpdate.id);
    this.reviewForUpdate.grade = parseFloat(this.inputForm.value.grade || '0');
    this.reviewForUpdate.comment = this.inputForm.value.comment as string;
    console.log('Editovani objekat', this.reviewForUpdate);
    this.update(this.reviewForUpdate);
    this.inputForm.reset();

    this.showComponent = false;
  }

  update(review: TourReview) {
    this.tourReviewService.updateReview(review).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
