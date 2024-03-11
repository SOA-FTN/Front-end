import { Component, OnInit } from '@angular/core';
import { VisualGalleryService } from '../visual-gallery.service';

@Component({
  selector: 'xp-visual-gallery',
  templateUrl: './visual-gallery.component.html',
  styleUrls: ['./visual-gallery.component.css']
})
export class VisualGalleryComponent implements OnInit {
  query: string;
  images: any[] = [];
  selectedImage: any;
  showPopup = false;

  constructor(private galleryService:VisualGalleryService ) {}
  ngOnInit(): void {
    this.galleryService.searchImages("Travel").subscribe({
      next: (result: any) => {
        this.images = result.results;
      },
      error: (err: any) => {
        console.error('Error fetching images', err);
      }
    }
   );
  }
  searchImages() {
    console.log(this.query);
    this.galleryService.searchImages(this.query).subscribe({
      next: (result: any) => {
        console.log('Evoo me');
        console.log(result.results)
        this.images = result.results;
      },
      error: (err: any) => {
        console.error('Error fetching images', err);
      }
    }
   );
 }
 openImagePopup(image: any): void {
  this.showPopup = true;
  this.selectedImage = image;
}
closePopup(): void {
  this.showPopup = false;
}
showNewYork(): void {
  this.query = "New York"
  this.galleryService.searchImages(this.query).subscribe({
    next: (result: any) => {
      this.images = result.results;
    },
    error: (err: any) => {
      console.error('Error fetching images', err);
    }
  }
 );
}
showLondon() : void {
  this.query = "London"
  this.galleryService.searchImages(this.query).subscribe({
    next: (result: any) => {
      this.images = result.results;
    },
    error: (err: any) => {
      console.error('Error fetching images', err);
    }
  }
 );
}
showTokyo() : void {
  this.query = "Tokyo"
  this.galleryService.searchImages(this.query).subscribe({
    next: (result: any) => {
      this.images = result.results;
    },
    error: (err: any) => {
      console.error('Error fetching images', err);
    }
  }
 );
}
clearSearchBar() : void {
  this.query = "";
}

}