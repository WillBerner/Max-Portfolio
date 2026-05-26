import { Component, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private ngZone: NgZone, private cd: ChangeDetectorRef) {}
  sampleProjects = [
    {
      title: 'POD A+D Model',
      image: 'assets/images/POD A+D Model 15.png',
      caption: 'Industrial conversion emphasizing open plan and raw finishes.',
    },
    {
      title: 'Rammed Earth Model',
      image: 'assets/images/Rammed Earth Model.JPG',
      caption: 'Material-driven rammed earth concept model.',
    },
    {
      title: 'Street View',
      image: 'assets/images/Street View.png',
      caption:
        'A quiet riverside retreat with generous glazing and clean timber details.',
    },
  ];

  // Slideshow/lightbox state
  slideshowOpen = false;
  currentIndex = 0;
  showControls = true;
  private controlsTimeout: any = null;

  openSlideshow(index: number) {
    this.currentIndex = index;
    this.slideshowOpen = true;
    this.showControls = true;
    document.body.style.overflow = 'hidden';
    this.resetHideTimer();
    this.addKeyListener();
    this.cd.detectChanges();
  }

  closeSlideshow() {
    this.slideshowOpen = false;
    document.body.style.overflow = '';
    this.clearHideTimer();
    this.removeKeyListener();
    this.cd.detectChanges();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.sampleProjects.length) % this.sampleProjects.length;
    this.showControls = true;
    this.resetHideTimer();
    this.cd.detectChanges();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.sampleProjects.length;
    this.showControls = true;
    this.resetHideTimer();
    this.cd.detectChanges();
  }

  onOverlayMouseMove() {
    // show controls when mouse moves and reset hide timer
    this.showControls = true;
    this.resetHideTimer();
  }

  private resetHideTimer() {
    this.clearHideTimer();
    this.controlsTimeout = setTimeout(() => {
      this.showControls = false;
    }, 5000);
  }

  private clearHideTimer() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }
  }

  // Keyboard and touch support
  private keyHandler = (e: KeyboardEvent) => {
    // run inside Angular's zone so change detection runs immediately
    this.ngZone.run(() => {
      if (!this.slideshowOpen) return;
      if (e.key === 'ArrowLeft') { this.prev(); }
      else if (e.key === 'ArrowRight') { this.next(); }
      else if (e.key === 'Escape') { this.closeSlideshow(); }
    });
  };

  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;

  onTouchStart(e: TouchEvent) {
    const t = e.touches[0];
    this.touchStartX = t.clientX;
    this.touchStartY = t.clientY;
    this.touchStartTime = Date.now();
    this.showControls = true;
    this.resetHideTimer();
  }

  onTouchMove(e: TouchEvent) {
    // keep showing controls while moving
    this.showControls = true;
    this.resetHideTimer();
  }

  onTouchEnd(e: TouchEvent) {
    const t = (e.changedTouches && e.changedTouches[0]) || null;
    if (!t) return;
    const dx = t.clientX - this.touchStartX;
    const dy = t.clientY - this.touchStartY;
    const dt = Date.now() - this.touchStartTime;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    // simple swipe detection: horizontal swipe with sufficient distance and less vertical movement
    if (absDx > 40 && absDx > absDy && dt < 1000) {
      if (dx > 0) { this.prev(); }
      else { this.next(); }
    }
    this.resetHideTimer();
  }

  private addKeyListener() {
    document.addEventListener('keydown', this.keyHandler);
  }

  private removeKeyListener() {
    document.removeEventListener('keydown', this.keyHandler);
  }

  ngOnDestroy(): void {
    this.clearHideTimer();
    document.body.style.overflow = '';
    this.removeKeyListener();
  }
}
