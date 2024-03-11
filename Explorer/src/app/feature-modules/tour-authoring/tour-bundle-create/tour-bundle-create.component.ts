import { Component } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../tour/model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourBundle } from '../model/tourBundle.model';

@Component({
  selector: 'xp-tour-bundle-create',
  templateUrl: './tour-bundle-create.component.html',
  styleUrls: ['./tour-bundle-create.component.css']
})
export class TourBundleCreateComponent {

  sumPrice:number=0
  tourBundle: TourBundle={
    id:0,
    name:'',
    price: 0,
    tourIds:[],
    status:'Draft'
  }
  selectedTourNames: string[] = [];
  selectedTours: number[]=[]
  tours: Tour[]=[]
  constructor(private tourAuthoringService: TourAuthoringService){
    this.getAllTours();
  }
  inputForm= new FormGroup({
    name: new FormControl('',[Validators.required]),
    price: new FormControl('',[Validators.required]),
  })
  getAllTours(){

    this.tourAuthoringService.getAllTours().subscribe({
      next:(response: PagedResults<Tour>)=>{
        this.tours=response.results
        console.log('Turee', this.tours)
      },
     
    })

    
  }

 
  

  selectTour(tour: Tour): void {
    const index = this.selectedTourNames.indexOf(tour.name);

    if (index !== -1) {
      // Ako je kartica već selektovana, ukloni je iz liste
      this.selectedTourNames.splice(index, 1);
    } else {
      // Inače, dodaj je u listu selektovanih kartica
      this.selectedTourNames.push(tour.name);
      this.sumPrice+=tour.price
      this.selectedTours.push(tour.id as number)
    }
  }

  createBundle(){
    this.populateBundle()
    this.tourAuthoringService.createTourBundle(this.tourBundle).subscribe({
      next:(response)=>{
        console.log('Kreiran Bundle', response)
      },
      error:(error)=>{
        console.log(error)
      }
    })
    
  }

  populateBundle(){
    this.tourBundle.name=this.inputForm.value.name as string
    this.tourBundle.price=parseFloat(this.inputForm.value.price || '0');
    this.tourBundle.tourIds=this.selectedTours

  }
}
