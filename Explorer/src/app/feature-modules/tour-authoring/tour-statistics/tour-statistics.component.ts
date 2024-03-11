import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js/auto'; // Use 'chart.js/auto' for the latest version
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../tour/model/tour.model';
import { TourPoint } from '../model/tourPoints.model';


@Component({
  selector: 'xp-tour-statistics',
  templateUrl: './tour-statistics.component.html',
  styleUrls: ['./tour-statistics.component.css']
})
export class TourStatisticsComponent {

  constructor(private tokenStorage: TokenStorage,private service:TourAuthoringService){
    this.loadTours();
    this.getNumberOfPurchasedTours();
    this.getMaxPercentages();
  }


  selectedOption: string = 'option1';
  shoulShowOneTourStatistic = false;

  chartOptions={

  }
  chartOptionsForTour ={

  }
  chartOptionsForTourPoints ={

  }
  percentages={

  }

  encountrsPercentageChartOptions={

  }
  numberOfPurchasedTours:number
  numberOfStartedTours:number
  numberOfCompletedTours:number

  maxPercentages:number[] = []
  numberOfPurchaseByTour:number
  numberOfStartingByTour:number
  numberOfCompletingByTour:number

  percentageForTourPoints: number[] = []
  tourPoints : TourPoint[] = []
  tourPointsName: string[] = []
  encounterPercentage:number[] = []

  tour:Tour[]=[]
  loadTours() {
    const userId = this.tokenStorage.getUserId();

    this.service.findAllPurchasedToursByAuthor(userId).subscribe({
      next: (result: Tour[]) => {
        this.tour = result;
      },
      error(err: any) {
        console.log(err);
      },
    });
  }

  getNumberOfPurchasedTours(){
    const userId = this.tokenStorage.getUserId();

    this.service.getNumberOfPurchasedToursByAuthor(userId).subscribe({
      next: (result: number) => {
        this.numberOfPurchasedTours = result;
        console.log('Prodate: ' + this.numberOfPurchasedTours);
        this.getNumberOfStartedTours(this.numberOfPurchasedTours);
      },
      error(err: any) {
        console.log(err);
      },
    });
   
  }

  getNumberOfStartedTours(purchased:number){
    const userId = this.tokenStorage.getUserId();

    this.service.getNumberOfStartedToursByAuthor(userId).subscribe({
      next: (result: number) => {
        this.numberOfStartedTours = result;
        console.log('Prodate: ' + this.numberOfPurchasedTours);
        this.getNumberOfCompletedTours(purchased,this.numberOfStartedTours);
      },
      error(err: any) {
        console.log(err);
      },
    });
   
  }
  getNumberOfCompletedTours(purchased:number,started:number){
    const userId = this.tokenStorage.getUserId();

    this.service.getNumberOfCompletedToursByAuthor(userId).subscribe({
      next: (result: number) => {
        this.numberOfCompletedTours = result;
        console.log('Prodate: ' + this.numberOfPurchasedTours);
       
      },
      error(err: any) {
        console.log(err);
      },
    });
    this.createChart(purchased,started,this.numberOfCompletedTours);
  }

  createChart(numberOfPurch:number,started:number,completed:number){

    this.chartOptions = {
      title: {
        text: "Statistics about sold tours"
      },
      animationEnabled: true,
      axisY: {
      includeZero: true
      },
      data: [{
      type: "column", 
      indexLabelFontColor: "#white",
      dataPoints: [
        { label: 'Sold', y: numberOfPurch },
        { label: 'Started', y: started },
        { label: 'Completed', y: completed }
      ]
      }]
    }
  
   }






   getMaxPercentages(){
    const userId = this.tokenStorage.getUserId();

    this.service.getMaxPercentage(userId).subscribe({
      next: (result: number[]) => {
        this.maxPercentages = result;
        this.createChartForMaxPercentages(this.maxPercentages[0],this.maxPercentages[1],this.maxPercentages[2],this.maxPercentages[3]);
       
      },
      error(err: any) {
        console.log(err);
      },
    });
  }

  createChartForMaxPercentages(first:number,second:number,third:number,fourth:number){

    this.percentages = {
      title: {
        text: "Statistics about tour"
      },
      animationEnabled: true,
      axisY: {
      includeZero: true
      },
      data: [{
      type: "column", 
      indexLabelFontColor: "#white",
      dataPoints: [
        { label: '0-25%', y: first },
        { label: '25-50%', y: second },
        { label: '50-75%', y: third },
        { label: '75-100%', y: fourth }
      ]
      }]
    }
  
   }
  //--------------ZA JEDNU TURU ------------------------------

  showStatistics(tour:Tour){
  this.numberOfPurchaseByTour = 0
  this.numberOfStartingByTour = 0
  this.numberOfCompletingByTour = 0

  this.percentageForTourPoints.length = 0;
  this.percentageForTourPoints.length = 0
  this.tourPoints.length = 0;
  this.tourPointsName.length = 0;
  this.chartOptions={

  }
  this.chartOptionsForTour ={

  }
  this.chartOptionsForTourPoints ={

  }
  this.percentages={

  }

  this.encountrsPercentageChartOptions={

  }
  this.tourPoints = tour.tourPoints;
    this.tourPoints.forEach(tp=>{
      this.tourPointsName.push(tp.name);
    })

    this.shoulShowOneTourStatistic = true;
    if(tour.id !== undefined){
      this.getNumberOfPurchaseByTour(tour.id);
      this.getVisitedTourPointPercentage(tour.id);
      this.getEncountersPercentage(tour.id);
    }
    
    
    
  }

  getEncountersPercentage(tourId:number){
    const userId = this.tokenStorage.getUserId();
    this.service.getTourPointEncounterPercentage(userId,tourId).subscribe({
      next: (result: number[]) => {
        this.encounterPercentage = result;
        this.createChartForEncounters(this.tourPointsName,this.encounterPercentage)
      },
      error(err: any) {
        console.log(err);
      },
    });

    
  }


  getNumberOfPurchaseByTour(tourId:number){
    const userId = this.tokenStorage.getUserId();
    this.service.getNumberOfPurchaseByTour(userId,tourId).subscribe({
      next: (result: number) => {
        this.numberOfPurchaseByTour = result;
        this.getNumberOfStartingByTour(tourId,this.numberOfPurchaseByTour);
      },
      error(err: any) {
        console.log(err);
      },
    });

    
  }

  getNumberOfStartingByTour(tourId:number,purchasing:number){
    const userId = this.tokenStorage.getUserId();
    this.service.getNumberOfStartedByTour(userId,tourId).subscribe({
      next: (result: number) => {
        this.numberOfStartingByTour = result;
        this.getNumberOfCompletingByTour(tourId,purchasing,this.numberOfStartingByTour);
      },
      error(err: any) {
        console.log(err);
      },
    });
    
  }

  getNumberOfCompletingByTour(tourId:number,purchasing:number,starting:number){
    const userId = this.tokenStorage.getUserId();

    this.service.getNumberOfCompletedByTour(userId,tourId).subscribe({
      next: (result: number) => {
        this.numberOfCompletingByTour = result;
        this.createChartForTour(purchasing,starting,this.numberOfCompletingByTour);
      },
      error(err: any) {
        console.log(err);
      },
    });
    
  }



  getVisitedTourPointPercentage(tourId:number){
    const userId = this.tokenStorage.getUserId();

    console.log("Usaooo")
    this.service.getVisitedTourPointPercentage(userId,tourId).subscribe({
      next: (result: number[]) => {
        this.percentageForTourPoints = result;
        console.log("Rez:" + this.percentageForTourPoints);
        this.createChartForTourPoints(this.tourPointsName,this.percentageForTourPoints);
      },
      error(err: any) {
        console.log(err);
      },
    });
    
  }

  createChartForTour(numberOfPurch:number,starting:number,completing:number){

    this.chartOptionsForTour = {
      title: {
        text: "Statistics about tour"
      },
      animationEnabled: true,
      axisY: {
      includeZero: true
      },
      data: [{
      type: "column", 
      indexLabelFontColor: "#white",
      dataPoints: [
        { label: 'Number of purchasing', y: numberOfPurch },
        { label: 'Number of starting', y: starting },
        { label: 'Number of completion', y: completing }
      ]
      }]
    }
  
   }

   createChartForTourPoints(tourPoints: string[], percentage: number[]) {
    this.chartOptionsForTourPoints = {
      title: {
        text: "Statistics about the percentage of completion of the tour point "
      },
      animationEnabled: true,
      axisY: {
        includeZero: true
      },
      data: [{
        type: "column",
        indexLabelFontColor: "#white",
        dataPoints: tourPoints.map((label, index) => ({
          label: label,
          y: percentage[index]
        }))
      }]
    };
  }

  createChartForEncounters(tourPoints: string[], percentage: number[]) {
    this.encountrsPercentageChartOptions = {
      title: {
        text: "Statistics about the percentage of completed encounters "
      },
      animationEnabled: true,
      axisY: {
        includeZero: true
      },
      data: [{
        type: "column",
        indexLabelFontColor: "#white",
        dataPoints: tourPoints.map((label, index) => ({
          label: label,
          y: percentage[index]
        }))
      }]
    };
  }
  
 





  

  }
  
