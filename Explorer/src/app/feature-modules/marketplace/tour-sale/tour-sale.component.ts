import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { TourSale } from '../model/tour-sale.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../../tour-authoring/tour/model/tour.model';

@Component({
  selector: 'xp-tour-sale',
  templateUrl: './tour-sale.component.html',
  styleUrls: ['./tour-sale.component.css'],
  providers: [DatePipe]
})
export class TourSaleComponent {
  tours: Tour[] = [];
  toursSelected: Tour[] = [];
  tours1: Tour[] = [];
  toursSelected1: Tour[] = [];
  tourSales: TourSale[] = [];
  selectedTourSale: TourSale;
  shouldEdit: boolean = false;
  shouldRenderTourSaleForm: boolean = false;
  srcd: boolean = false;
  showupdt: boolean = false;
  user: number;

  constructor(private service: MarketplaceService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user.id;
      console.log(this.user);
    });
    this.getTourSales(this.user);
  }

  discard(): void {
    this.shouldEdit = false;
    this.shouldRenderTourSaleForm = false;
    this.srcd = false;
    this.showupdt = false;
  }

  onDateChange(): void {
    this.showupdt = false;
  }

  getTourSales(id: number): void {
    if(!this.shouldEdit) this.shouldRenderTourSaleForm = false;

    this.service.getTourSales(id).subscribe({
      next: (result: PagedResults<TourSale>) => {
        console.log(result);
        this.tourSales = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onEditClicked(ts: TourSale): void {
    this.tourSaleForm1.reset();
    this.tourSaleForm2.reset();
    this.tourSaleForm3.reset();
    this.discard();
    this.shouldRenderTourSaleForm = true;
    this.shouldEdit = true;
    this.selectedTourSale = ts;
    this.tourSaleForm3.get('date1')?.setValue(this.selectedTourSale.startDate.toString().split('T')[0]);
    this.tourSaleForm3.get('date2')?.setValue(this.selectedTourSale.endDate.toString().split('T')[0]);
    this.tourSaleForm3.get('salePerc')?.setValue(this.selectedTourSale.salePercentage);

    setTimeout(() => {
      this.scrollToBottom();
    }, 50);
  }

  onDeleteClicked(ts: TourSale): void {
    this.tourSaleForm1.reset();
    this.tourSaleForm2.reset();
    this.tourSaleForm3.reset();
    this.discard();
    this.selectedTourSale = ts;
    this.service.deleteTourSale(this.selectedTourSale).subscribe({
      next: (_) => {
        console.log("Deleted");
        this.getTourSales(this.user);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onAddClicked(): void {
    this.discard();
    this.shouldRenderTourSaleForm = true;

    setTimeout(() => {
      this.scrollToBottom();
    }, 50);
  }

  scrollToBottom() {
    const height = document.documentElement.scrollHeight;
    window.scrollTo(0, height);
  }

  tourSaleForm1 = new FormGroup({
    date1: new FormControl(''),
    date2: new FormControl('')
  });
  tourSaleForm2 = new FormGroup({
    salePerc:  new FormControl(0, [Validators.min(1), Validators.max(100)])
  });
  tourSaleForm3 = new FormGroup({
    date1: new FormControl(''),
    date2: new FormControl(''),
    salePerc: new FormControl(0, [Validators.min(1), Validators.max(100)])
  });

  searchTourSale(): void {
    this.srcd = false;
    if (!this.tourSaleForm1.value.date1 || !this.tourSaleForm1.value.date2) { alert('Insert dates.'); return; }
    const d1 = this.tourSaleForm1.value.date1.toString().split('T')[0];
    const d2 = this.tourSaleForm1.value.date2.toString().split('T')[0];

    let currentDate = new Date();
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    currentDate.setHours(0, 0, 0, 0);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    if (date1 >= currentDate && date2 >= currentDate && date1 <= date2) {
      const dateDifference = Math.abs(date2.getTime() - date1.getTime());
      const daysDifference = Math.ceil(dateDifference / (1000 * 3600 * 24));

      if (daysDifference <= 14) {

        setTimeout(() => {
          this.scrollToBottom();
        }, 50);
      } else {
        alert('Dates are more than 14 days apart.');
        return;
      }
    } else {
      alert('Invalid date order or date is in the past.');
      return;
    }

    this.service.getPubToursForAut(this.user).subscribe({
      next: (result) => {
        console.log('Searched');
        this.tours = result.results;
        this.toursSelected = [];
        let copp = this.tourSales;

        if (this.tourSales && this.tours) {
          this.tours = this.tours.filter(tour => {
            const tourId = tour.id || -1;
            let xx = true;
            copp.forEach((elem) => {
              if(elem.startDate.toString().split('T')[0] <= d2 && d1 <= elem.endDate.toString().split('T')[0]) {
                if(elem.tourIds.includes(tourId)) {xx = false;}
              }
            });
            return xx;
          });
        }
        if(this.tours.length == 0) {
          alert('None available found.');
          this.srcd = false;
        }
        else this.srcd = true;
      }
    });
  }
  onPlusTour1(id: Tour): void {
    const index = this.tours1.indexOf(id);
    if (index !== -1) {
      this.toursSelected1.push(id);
      this.tours1.splice(index, 1);
    }
  }
  onMinusTour1(id: Tour): void {
    const index = this.toursSelected1.indexOf(id);
    if (index !== -1) {
      this.tours1.push(id);
      this.toursSelected1.splice(index, 1);
    }
  }

  onPlusTour(id: Tour): void {
    const index = this.tours.indexOf(id);
    if (index !== -1) {
      this.toursSelected.push(id);
      this.tours.splice(index, 1);
    }
  }
  onMinusTour(id: Tour): void {
    const index = this.toursSelected.indexOf(id);
    if (index !== -1) {
      this.tours.push(id);
      this.toursSelected.splice(index, 1);
    }
  }

  addTourSale(): void {
    if(this.toursSelected.length == 0) {
      alert('None selected.')
      return;
    }

    const tourSale: TourSale = {
      authorId: this.user,
      startDate: this.tourSaleForm1.value.date1
        ? new Date(this.tourSaleForm1.value.date1)
        : new Date(Date.now()),
      endDate: this.tourSaleForm1.value.date2
        ? new Date(this.tourSaleForm1.value.date2)
        : new Date(Date.now()),
      salePercentage: this.tourSaleForm2.value.salePerc || 0,
      tourIds: this.toursSelected.map(tour => tour?.id || -1)
    }
    if(tourSale.salePercentage == 0) {
      alert('Enter discount.');
      return;
    }
    this.service.addTourSale(tourSale).subscribe({
      next: (_) => {
        console.log('Sale Created')
        this.tourSaleForm1.reset();
        this.tourSaleForm2.reset();
        this.tourSaleForm3.reset();
        this.showupdt = false;
        this.shouldRenderTourSaleForm = false;
        this.srcd = false;
        this.getTourSales(this.user)
      }
    });
  }
  updateTourSale1(): void {
    this.showupdt = false;
    this.tours = [];
    this.toursSelected = [];
    this.tours1 = [];
    this.toursSelected1 = [];
    if (!this.tourSaleForm3.value.date1 || !this.tourSaleForm3.value.date2) return;
    const d1 = this.tourSaleForm3.value.date1.toString().split('T')[0];
    const d2 = this.tourSaleForm3.value.date2.toString().split('T')[0];

    let currentDate = new Date();
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    currentDate.setHours(0, 0, 0, 0);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    if (date1 >= currentDate && date2 >= currentDate && date1 <= date2) {
      const dateDifference = Math.abs(date2.getTime() - date1.getTime());
      const daysDifference = Math.ceil(dateDifference / (1000 * 3600 * 24));

      if (daysDifference <= 14) {

        setTimeout(() => {
          this.scrollToBottom();
        }, 50);

      } else {
        alert('Dates are more than 14 days apart.');
        return;
      }
    } else {
      alert('Invalid date order or date is in the past.');
      return;
    }

    this.service.getPubToursForAut(this.user).subscribe({
      next: (result) => {
        console.log('Searched');
        this.tours = result.results;
        this.toursSelected = [];
        let copp = this.tourSales;

        if (this.tourSales && this.tours) {
          this.tours = this.tours.filter(tour => {
            const tourId = tour.id || -1;
            let xx = true;
            copp.forEach((elem) => {
              if(elem.id == this.selectedTourSale.id) {console.log("dubl")} else{
              if(elem.startDate.toString().split('T')[0] <= d2 && d1 <= elem.endDate.toString().split('T')[0]) {
                if(elem.tourIds.includes(tourId)) {xx = false;}
              }}
            });
            return xx;
          });
        }
        //check availabilty for dates to tours
        if(!this.selectedTourSale.tourIds) this.toursSelected1 = [];
        else {
          let coppp = this.tours;
          coppp.forEach((elem) => {
            if(!this.selectedTourSale.tourIds.includes(elem.id || -1)) {
              this.tours1.push(elem);
            }
            else this.toursSelected1.push(elem);
          });
        }
        if(this.tours1.length == 0 && this.toursSelected1.length == 0) {
          alert('None available found.');
          this.showupdt = false;
        }
        else this.showupdt = true;
      }
    });
  }

  updateTourSale(): void {
    if(this.toursSelected1.length == 0) {
      alert('None selected.')
      return;
    }

    const tourSale: TourSale = {
      authorId: this.user,
      startDate: this.tourSaleForm3.value.date1
        ? new Date(this.tourSaleForm3.value.date1)
        : new Date(Date.now()),
      endDate: this.tourSaleForm3.value.date2
        ? new Date(this.tourSaleForm3.value.date2)
        : new Date(Date.now()),
      salePercentage: this.tourSaleForm3.value.salePerc || 0,
      tourIds: this.toursSelected1.map(tour => tour?.id || -1)
    }
    tourSale.id = this.selectedTourSale.id;
    if(tourSale.salePercentage == 0) {
      alert('Enter discount > 0.');
      return;
    }
    this.service.updateTourSale(tourSale).subscribe({
      next: (_) => {
        console.log('Sale Updated')
        this.showupdt = false;
        this.getTourSales(this.user);
        this.selectedTourSale.tourIds = this.toursSelected1.map(tour => tour?.id || -1);
      }
    });
  }
}
