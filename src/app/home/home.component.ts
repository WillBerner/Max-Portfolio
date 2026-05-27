import { Component, OnDestroy, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private ngZone: NgZone, private cd: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // open slideshow when arriving with ?slideId=<id> or ?slide=<index>
    this.route.queryParams.subscribe((params) => {
      const slideId = params['slideId'];
      if (slideId !== undefined && slideId !== null) {
        const idx = this.sampleProjects.findIndex((p) => p.id === slideId);
        if (idx !== -1) {
          this.openSlideshow(idx);
          this.router.navigate([], { queryParams: {}, replaceUrl: true });
          return;
        }
      }

      const s = params['slide'];
      if (s !== undefined && s !== null) {
        const idx = Number(s);
        if (!isNaN(idx)) {
          this.openSlideshow(idx);
          this.router.navigate([], { queryParams: {} , replaceUrl: true });
        }
      }
    });
  }

  sampleProjects = [
    {
      id: 'modern-loft',
      title: 'POD A+D VENICE BIENNIAL',
      subtitle: '3D PRINTED MODEL',
      image: 'assets/images/POD A+D Model 15.png',
      caption: 'POD A+D VENICE BIENNIAL\n3D PRINTED MODEL',
    },
    {
      id: 'studio-renovation',
      title: 'A CENTER FOR THE BUILT ENVIRONMENT',
      subtitle: 'RAMMED EARTH MODEL',
      image: 'assets/images/Rammed Earth Model.JPG',
      caption: 'A CENTER FOR THE BUILT ENVIRONMENT\nRAMMED EARTH MODEL',
    },
    {
      id: 'riverside-house',
      title: 'A CENTER FOR THE BUILT ENVIRONMENT',
      subtitle: 'EXTERIOR RENDER',
      image: 'assets/images/Street View.png',
      caption: 'A CENTER FOR THE BUILT ENVIRONMENT\nEXTERIOR RENDER',
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
    document.body.classList.add('slideshow-open');
    this.resetHideTimer();
    this.addKeyListener();
    this.cd.detectChanges();
  }

  closeSlideshow() {
    this.slideshowOpen = false;
    document.body.style.overflow = '';
    this.clearHideTimer();
    this.removeKeyListener();
    document.body.classList.remove('slideshow-open');
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

  private keyHandler = (e: KeyboardEvent) => {
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
    document.body.classList.remove('slideshow-open');
  }
}