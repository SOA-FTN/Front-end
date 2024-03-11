import { ChangeDetectorRef, Component } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { TourBundle } from '../model/tourBundle.model';
import { Tour } from '../tour/model/tour.model';
import { TourContainer } from '../model/tourContainer.model';
import { Bundle } from '../model/bundle.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'xp-tour-bundles-show',
  templateUrl: './tour-bundles-show.component.html',
  styleUrls: ['./tour-bundles-show.component.css']
})
export class TourBundlesShowComponent {

  _observableList: BehaviorSubject<Bundle[]> = new BehaviorSubject<Bundle[]>([]);
  bundles: Bundle[]=[]
  bundle: Bundle={
    id:0,
    name:'',
    price:0,
    status:'Draft',
    tours: []

  }
  tourBundle: TourBundle={
    id:0,
    name:'',
    price:0,
    status:'Draft',
    tourIds: []

  }
  allBundles: TourBundle[]=[]
  toursByBundle: Tour[] = []

  constructor(private tourAuthoringService: TourAuthoringService, private cdRef: ChangeDetectorRef){
    this.getAllBundles()

  }

  getAllBundles(){
    this.tourAuthoringService.getAllBundles().subscribe({
      next:(response)=>{
        this.allBundles=response.results
        console.log('Paketi',this.allBundles)
        this.getToursByBundles()
      },
      error: (error)=>{
        console.log(error)
      }
    })
  }

  getToursByBundles(){
    this.bundles=[]
    for (let i = 0; i < this.allBundles.length; i++){
      const bundle: Bundle = {
        id: this.allBundles[i].id,
        name: this.allBundles[i].name,
        price: this.allBundles[i].price,
        status: this.allBundles[i].status ,
        tours: []
      };
      this.tourAuthoringService.getToursByBundle(this.allBundles[i].tourIds).subscribe({
        next:(response)=>{
        bundle.tours = response.results;
        console.log('Bundle', bundle);
        
        this.bundles.push(bundle);
        
       
        console.log('Bundles', this.bundles);
      
        },
        error:(error)=>{
          console.log(error)
        }
      })
    } 
    this._observableList.next(this.bundles)
    
    
  }

  publish(bundle: Bundle){
    var i=0
    const publishedToursCount = bundle.tours.filter(tour => tour.status === 'Published').length;



    if(publishedToursCount>=2){
    this.populateTourBundle(bundle)

    this.tourAuthoringService.updateBundle(this.tourBundle).subscribe({

      next:(response)=>{
        console.log('Response', response)
        this.getAllBundles()
        console.log('Apdejtovane', this.allBundles)
      },
      error:(error)=>{
        console.log(error)
      }
    })
    }else{
      console.log('Nisu sve publishovane')
    }
  }

  populateTourBundle(bundle: Bundle){
    this.tourBundle.id=bundle.id
    this.tourBundle.price=bundle.price
    this.tourBundle.name=bundle.name
    this.tourBundle.status="Published"
    bundle.tours.forEach(tour=>{
      this.tourBundle.tourIds.push(tour.id as number)
    })
    console.log('Za publishovanje', this.tourBundle)
    
  }

  delete(bundle:Bundle){
    if(bundle.status!="Published"){
    this.tourAuthoringService.deleteBundle(bundle.id).subscribe({
      next:(response)=>{
        console.log(response)
        this.getAllBundles()
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }
  else{
    console.log('Paket je published , ne moze se obrisati')
  }
  }

  archive(bundle:Bundle){
    const tourBundle: TourBundle={
      id:0,
      name:'',
      price:0,
      tourIds:[],
      status:''
    }

    tourBundle.id=bundle.id
    tourBundle.status="Archived"
    tourBundle.name=bundle.name
    tourBundle.price=bundle.price
   
    bundle.tours.forEach(tour=>{
      tourBundle.tourIds.push(tour.id as number)
    })
    
    this.tourAuthoringService.updateBundle(tourBundle).subscribe({
      next:(response)=>{
        console.log(response)
        this.getAllBundles()
      },
      error:(error)=>{
        console.log(error)
      }
    })
    }
 
}
