import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TouristEquipment } from '../model/touristEquipment.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Equipment } from '../../tour-authoring/tour/model/equipment.model';
import { Tour } from '../../tour-authoring/tour/model/tour.model';

@Component({
  selector: 'xp-tourist-equipment',
  templateUrl: './tourist-equipment.component.html',
  styleUrls: ['./tourist-equipment.component.css']
  
})
export class TouristEquipmentComponent implements OnInit {

  
  tEquipment: TouristEquipment;
  loggedInUser:number;
  equipmentIds:number[];
  equipments:Equipment[];
  otherEquipment:Equipment[] = [];
  
  constructor(private service:MarketplaceService,private authService:AuthService){
    this.getLoggedInUser();
    this.tEquipment = {id: 0,touristId: this.loggedInUser , equipment: [] };
    this.equipments = [];
  }

  getLoggedInUser(){
    this.authService.user$.subscribe(user=>{
      if(user){
        this.loggedInUser = user.id;
        console.log('Id ulogovanog: '+this.loggedInUser);
      }
    })
  }



  
  getOtherEquipment(ids: number[]):void{
    this.service.getOtherEquipment(ids).subscribe({
      next:(result:Equipment[])=>{
        this.otherEquipment = result;
      } 
    })
  }
  
  onAddClicked(e:Equipment):void{
    if (e.id !== undefined){
      this.service.addToMyEquipment(this.loggedInUser, e.id).subscribe({
        next:(result: TouristEquipment)=>{
          this.tEquipment = result;
          this.equipments.length = 0;
          this.otherEquipment.length =0;
          this.getAllEquipmentForTourist(this.tEquipment.equipment);
        } 
      })
    }
    
  }

  deleteEquipment(e:Equipment):void{
    if (e.id !== undefined){
      this.service.removeFromMyEquipment(this.loggedInUser,e.id).subscribe({
        next: (result: TouristEquipment)=>{
          this.tEquipment = result;
          this.equipments.length =0;
          this.otherEquipment.length =0;
          this.getAllEquipmentForTourist(this.tEquipment.equipment);

          console.log(result)
        },
        error: (error)=>{
          console.log(error);
        }
      })
 
    }
  }

  ngOnInit(): void {
    this.service.getTouristEquipment(this.loggedInUser).subscribe({
      next: (result: TouristEquipment) => {
        console.log("Lista rezultaa: ", result);
        if (result === undefined || !result.equipment) {
          this.service.createTouristEquipment(this.loggedInUser).subscribe({
            next:(newResult: TouristEquipment) => {
              this.tEquipment = newResult;
              this.equipmentIds = newResult.equipment || [];
              console.log("REz dobijen za ideve: " + newResult.equipment);
              this.getAllEquipmentForTourist(this.equipmentIds);
            }
          });
        } else {
          this.tEquipment = result;
          this.equipmentIds = result.equipment || [];
          console.log("REz dobijen za ideve: " + result.equipment);
          this.getAllEquipmentForTourist(this.equipmentIds);
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  
  getAllEquipmentForTourist(ids: number[]): void {
    if (!Array.isArray(ids)) {
      console.log('IDs nisu definirani ili nisu niz.');
      return;
    }
  
    console.log("Usao: " + ids);
    this.service.getMyEquipment(ids).subscribe({
      next: (result: Equipment[]) => {
        this.equipments = result || [];
      },
      error: (error: any) => {
        console.log(error);
      }
    });
    this.getOtherEquipment(ids);
  }
  

}
