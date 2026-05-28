import { Component, OnDestroy, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'assets/pdf.worker.min.mjs';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  pdf: string;
  thumbnail?: string;
}

@Component({
  standalone: true,
  selector: 'app-projects',
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  constructor(private ngZone: NgZone, private cd: ChangeDetectorRef) {}

  projects: Project[] = [
    {
      id: 'center-for-contemporary-architecture',
      title: 'A CENTER FOR THE BUILT ENVIRONMENT',
      subtitle: 'THESIS PROJECT',
      pdf: 'assets/pdfs/Center_for_Contemporary_Architecture.pdf',
    },
    {
      id: 'permit-set-1',
      title: 'OGDEN HOUSE',
      subtitle: 'PERMIT SET 1',
      pdf: 'assets/pdfs/PERMIT_SET_1.pdf',
    },
    {
      id: 'permit-set-3',
      title: 'OGDEN HOUSE',
      subtitle: 'PERMIT SET 3',
      pdf: 'assets/pdfs/PERMIT_SET_3.pdf',
    },
    {
      id: 'rabbit-hole',
      title: 'POD A+D RABBIT HOLE DISTILLERY',
      subtitle: 'VENICE BIENNIAL MODEL',
      pdf: 'assets/pdfs/Rabbit_Hole.pdf',
    },
  ];

  ngOnInit() {
  this.generateThumbnails();
}

async generateThumbnails() {
  for (const project of this.projects) {
    try {
      const pdf = await pdfjsLib.getDocument(project.pdf).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 0.4 });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: ctx,
        viewport
      }).promise;

      project.thumbnail = canvas.toDataURL('image/jpeg', 0.85);

      this.cd.detectChanges();
    } catch (err) {
      console.error('Thumbnail generation failed:', err);
    }
  }
}

  // Slideshow state
  slideshowOpen = false;
  currentProject: Project | null = null;
  currentPage = 1;
  totalPages = 0;
  showControls = true;
  isLoading = false;
  loadError = false;

  private pdfDoc: any = null;
  private controlsTimeout: any = null;
  private keyHandler = (e: KeyboardEvent) => {
    this.ngZone.run(() => {
      if (!this.slideshowOpen) return;
      if (e.key === 'ArrowLeft') this.prevPage();
      else if (e.key === 'ArrowRight') this.nextPage();
      else if (e.key === 'Escape') this.closeSlideshow();
    });
  };

  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;

  openPdf(project: Project) {
    this.currentProject = project;
    this.currentPage = 1;
    this.totalPages = 0;
    this.slideshowOpen = true;
    this.showControls = true;
    this.isLoading = true;
    this.loadError = false;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('slideshow-open');
    this.resetHideTimer();
    document.addEventListener('keydown', this.keyHandler);
    this.cd.detectChanges();

    pdfjsLib.getDocument(project.pdf).promise.then((pdf: any) => {
      this.ngZone.run(() => {
        this.pdfDoc = pdf;
        this.totalPages = pdf.numPages;
        this.isLoading = false;
        this.cd.detectChanges();
        // setTimeout(0): let Angular flush the DOM so the canvas element exists
        // before we try to render into it
        setTimeout(() => this.renderPage(this.currentPage), 0);
      });
    }).catch((err: any) => {
      console.error('PDF load error:', err);
      this.ngZone.run(() => {
        this.isLoading = false;
        this.loadError = true;
        this.cd.detectChanges();
      });
    });
  }

  renderPage(pageNum: number) {
    if (!this.pdfDoc) return;
    this.isLoading = true;
    this.cd.detectChanges();

    this.pdfDoc.getPage(pageNum).then((page: any) => {
      const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
      if (!canvas) {
        console.error('pdf-canvas element not found in DOM');
        this.ngZone.run(() => { this.isLoading = false; this.cd.detectChanges(); });
        return;
      }

      const container = canvas.parentElement!;
      const maxW = container.clientWidth * 0.88;
      const maxH = container.clientHeight * 0.88;

      const viewport = page.getViewport({ scale: 1 });
      const scale = Math.min(maxW / viewport.width, maxH / viewport.height);
      const scaledViewport = page.getViewport({ scale });

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      const ctx = canvas.getContext('2d');
      page.render({ canvasContext: ctx, viewport: scaledViewport }).promise.then(() => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.cd.detectChanges();
        });
      }).catch((err: any) => {
        console.error('Render error:', err);
        this.ngZone.run(() => { this.isLoading = false; this.cd.detectChanges(); });
      });
    }).catch((err: any) => {
      console.error('getPage error:', err);
      this.ngZone.run(() => { this.isLoading = false; this.cd.detectChanges(); });
    });
  }

  prevPage() {
    if (this.currentPage <= 1) return;
    this.currentPage--;
    this.showControls = true;
    this.resetHideTimer();
    this.renderPage(this.currentPage);
  }

  nextPage() {
    if (this.currentPage >= this.totalPages) return;
    this.currentPage++;
    this.showControls = true;
    this.resetHideTimer();
    this.renderPage(this.currentPage);
  }

  closeSlideshow() {
    this.slideshowOpen = false;
    this.pdfDoc = null;
    this.currentProject = null;
    this.totalPages = 0;
    this.currentPage = 1;
    document.body.style.overflow = '';
    document.body.classList.remove('slideshow-open');
    this.clearHideTimer();
    document.removeEventListener('keydown', this.keyHandler);
    this.cd.detectChanges();
  }

  onOverlayMouseMove() {
    this.showControls = true;
    this.resetHideTimer();
  }

  private resetHideTimer() {
    this.clearHideTimer();
    this.controlsTimeout = setTimeout(() => {
      this.ngZone.run(() => {
        this.showControls = false;
        this.cd.detectChanges();
      });
    }, 5000);
  }

  private clearHideTimer() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }
  }

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
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) && dt < 1000) {
      if (dx > 0) this.prevPage();
      else this.nextPage();
    }
    this.resetHideTimer();
  }

  ngOnDestroy() {
    this.clearHideTimer();
    document.body.style.overflow = '';
    document.body.classList.remove('slideshow-open');
    document.removeEventListener('keydown', this.keyHandler);
  }
}