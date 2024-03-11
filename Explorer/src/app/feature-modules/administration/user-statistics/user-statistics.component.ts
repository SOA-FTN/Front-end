import { Component, OnInit } from '@angular/core';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { AdministrationService } from '../administration.service';
import { UserMileage } from '../model/user-statistics.model';

@Component({
  selector: 'xp-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit{
  userId : number;
  sortedByAllTimeMileages: UserMileage[] = [];
  sortedByMonthMileages: UserMileage[] = [];
  userMileages: UserMileage[] = [];
  userMileage: UserMileage | null;
  sortOption: string = 'allTime';
  sortAllTime: boolean = true;
  sortByMonth: boolean = false;

  constructor(private tokenStorage: TokenStorage, private service: AdministrationService){}

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUserId();
    console.log("userId: ", this.userId);
    this.getAllUserMileages();
    this.getSortedByMonth();
    this.updateSortOptions();
  }

  onSortOptionChange(): void {
    this.updateSortOptions();
  }

  private updateSortOptions(): void {
    if (this.sortOption === 'allTime') {
      this.userMileages = this.sortedByAllTimeMileages;
    } else if (this.sortOption === 'byMonth') {
      console.log("aaaa");
      this.userMileages = this.sortedByMonthMileages;
    }
  }

  getAllUserMileages(): void {
    this.service.getAllUserMileages().subscribe(
      (result) => {
        this.sortedByAllTimeMileages = result.results;
        this.userMileages = result.results;
        console.log("User mileages: ", this.sortedByAllTimeMileages);
        this.getUserMileage();
        

      },
      (error) => {
        console.error('Error fetching user positions:', error);
      }
    );
  }

  getSortedByMonth() : void{
    this.service.getAllUserMileagesByMonth().subscribe(
      (result) => {
        this.sortedByMonthMileages = result.results;
        console.log("User mileages by Month: ", this.userMileages);

      },
      (error) => {
        console.error('Error fetching user positions:', error);
      }
    );
  }

  getUserMileage(): void {
    const filteredMileages = this.userMileages.filter((mileage) => mileage.userId === this.userId);
  
    // Assuming there should be only one UserMileage for the current user
    this.userMileage = filteredMileages.length > 0 ? filteredMileages[0] : null;
  
    console.log("User mileage for current user: ", this.userMileage);
  }


}
