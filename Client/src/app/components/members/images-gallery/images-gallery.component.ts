import { Component, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { IPhoto } from '../../../models/iphoto';

@Component({
  selector: 'app-images-gallery',
  standalone: true,
  imports: [],
  templateUrl: './images-gallery.component.html',
  styleUrl: './images-gallery.component.css',
  animations: [
    trigger('animation', [
      transition('void => visible', [
        style({transform: 'scale(0.5)'}),
        animate('150ms', style({transform: 'scale(1)'}))
      ]),
      transition('visible => void', [
        style({transform: 'scale(1)'}),
        animate('150ms', style({transform: 'scale(0.5)'}))
      ])
    ]),
    trigger('animation2', [
      transition(':leave', [
        style({opacity:1}),
        animate('50ms', style({opacity:0.8}))
      ])
    ])
  ]
})
export class ImagesGalleryComponent implements OnInit{

  @Input() images:IPhoto[] = [];
  @Input() showCount = false;
  previewImage = false;
  showMask = false;
  currentLightboxImage:IPhoto = this.images[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;

  ngOnInit(): void {
    this.totalImageCount = this.images.length;
  }

  openPreviewImage(index:number){
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.currentLightboxImage = this.images[index];
  }

  onAnimationEnd(event:AnimationEvent){
    if(event.toState === 'void'){
      this.showMask = false;
    }
  }

  onClosePreview(){
    this.previewImage = false;
  }

  next(){
    this.currentIndex = this.currentIndex + 1;
    if(this.currentIndex > this.images.length -1) this.currentIndex = 0;
    this.currentLightboxImage = this.images[this.currentIndex];
  }

  prev(){
    this.currentIndex = this.currentIndex - 1;
    if(this.currentIndex < 0) this.currentIndex = this.images.length -1;
    this.currentLightboxImage = this.images[this.currentIndex];
  }
}
