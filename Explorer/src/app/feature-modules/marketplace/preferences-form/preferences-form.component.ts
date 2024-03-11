import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MarketplaceService} from "../marketplace.service";
import {DifficultyLevel, Preferences} from "../model/preferences.model";
import {AuthService} from 'src/app/infrastructure/auth/auth.service';
import {User} from 'src/app/infrastructure/auth/model/user.model';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'xp-preferences-form',
  templateUrl: './preferences-form.component.html',
  styleUrls: ['./preferences-form.component.css']
})
export class PreferencesFormComponent implements OnChanges {

  user: User | undefined;
  difficultyLevels: string[] = Object.values(DifficultyLevel);
  datasource: MatTableDataSource<string>;
  tags: string[] = [];
  newTag: string;
  transportationMarks: number[] = [0, 0, 0, 0];

  @Output() preferencesUpdated = new EventEmitter<null>();
  @Input() preferences: Preferences;
  @Input() shouldEdit: boolean = false;

  constructor(private service: MarketplaceService, private authService: AuthService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.preferencesForm.reset();
    this.newTag = '';
    this.tags = [];
    this.datasource = new MatTableDataSource<string>(this.tags);
    if (this.shouldEdit) {
      this.preferencesForm.patchValue(this.preferences);
      this.tags = this.preferences.interestTags;
      this.datasource = new MatTableDataSource<string>(this.tags);
      this.patchMarks();
    }
  }

  patchMarks(): void {
    this.preferencesForm.get('walking')?.setValue(this.preferences.transportationPreferences[0]);
    this.preferencesForm.get('biking')?.setValue(this.preferences.transportationPreferences[1]);
    this.preferencesForm.get('car')?.setValue(this.preferences.transportationPreferences[2]);
    this.preferencesForm.get('boat')?.setValue(this.preferences.transportationPreferences[3]);
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  preferencesForm = new FormGroup({
    preferredDifficulty: new FormControl('', [Validators.required]),
    tag: new FormControl(''),
    walking: new FormControl(0, [Validators.min(0), Validators.max(3)]),
    biking: new FormControl(0, [Validators.min(0), Validators.max(3)]),
    car: new FormControl(0, [Validators.min(0), Validators.max(3)]),
    boat: new FormControl(0, [Validators.min(0), Validators.max(3)])
  })

  updateMarks(): void {
    this.transportationMarks[0] = this.preferencesForm.value.walking || 0;
    this.transportationMarks[1] = this.preferencesForm.value.biking || 0;
    this.transportationMarks[2] = this.preferencesForm.value.car || 0;
    this.transportationMarks[3] = this.preferencesForm.value.boat || 0;
  }

  addPreferences(): void {

    this.updateMarks();

    const preferences: Preferences = {
      userId: this.user?.id || -1,
      preferredDifficulty: this.preferencesForm.value.preferredDifficulty as DifficultyLevel,
      transportationPreferences: this.transportationMarks,
      interestTags: this.tags
    }

    if (this.preferencesForm.valid) {
      this.service.addPreferences(preferences).subscribe({
        next: () => {
          this.preferencesUpdated.emit();
          this.preferencesForm.reset();
          this.newTag = '';
        },
        error: (err) => {
          console.error('Error: ', err);
        }
      });
    }
  }

  updatePreferences(): void {

    this.updateMarks();

    const preferences: Preferences = {
      userId: this.preferences.userId,
      preferredDifficulty: this.preferencesForm.value.preferredDifficulty as DifficultyLevel,
      transportationPreferences: this.transportationMarks,
      interestTags: this.tags
    }
    preferences.id = this.preferences.id;

    if (this.preferencesForm.valid) {
      this.service.updatePreferences(preferences).subscribe({
        next: () => {
          this.preferencesUpdated.emit();
          this.preferencesForm.reset();
          this.newTag = '';
        }
      });
    }
  }

  onAddTagClick(tag: string): void {
    if (tag.length > 0) {
      this.tags.push(tag);
      this.newTag = '';
      this.datasource = new MatTableDataSource<string>(this.tags);
    }
  }

  onDelete(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.datasource = new MatTableDataSource<string>(this.tags);
    }
  }
}
