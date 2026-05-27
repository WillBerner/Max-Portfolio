import { Component, OnDestroy, NgZone, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.mjs';

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  pdf?: string;
  pageCount?: number;
}

@Component({
  standalone: true,
  selector: 'app-projects',
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnDestroy {
  constructor(private ngZone: NgZone, private cd: ChangeDetectorRef) {}

  projects: Project[] = [
    {
      id: 'pdf-project-1',
      title: 'PDF Project 1',
      description: 'PROJECT ONE',
      pdf: 'assets/pdfs/Center for Contemporary Architecture.pdf',
      image: 'assets/pdfs/Center for Contemporary Architecture.pdf', // thumbnail shown on tile
    },
    {
      id: 'pdf-project-2',
      title: 'PDF Project 2',
      description: 'PROJECT TWO',
      pdf: 'assets/pdfs/PERMIT SET 1.pdf',
      image: 'assets/pdfs/PERMIT SET 1.pdf',
    },
    {
      id: 'pdf-project-3',
      title: 'PDF Project 3',
      description: 'PROJECT THREE',
      pdf: 'assets/pdfs/PERMIT SET 3.pdf',
      image: 'assets/pdfs/PERMIT SET 3.pdf',
    },
    {
      id: 'pdf-project-4',
      title: 'PDF Project 4',
      description: 'PROJECT FOUR',
      pdf: 'assets/pdfs/Rabbit Hole.pdf',
      image: 'assets/pdfs/Rabbit Hole.pdf',
    },
  ];

  // Slideshow state
  slideshowOpen = false;
  currentProject: Project | null = null;
  currentPage = 1;
  totalPages = 0;
  showControls = true;
  isLoading = false;

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

  // Touch support
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;

  openPdf(project: Project) {
    this.currentProject = project;
    this.currentPage = 1;
    this.slideshowOpen = true;
    this.showControls = true;
    this.isLoading = true;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('slideshow-open');
    this.resetHideTimer();
    document.addEventListener('keydown', this.keyHandler);
    this.cd.detectChanges();

    // Load the PDF using PDF.js (loaded via CDN in index.html)
    pdfjsLib.getDocument(project.pdf).promise.then((pdf: any) => {
      this.ngZone.run(() => {
        this.pdfDoc = pdf;
        this.totalPages = pdf.numPages;
        this.isLoading = false;
        this.cd.detectChanges();
        this.renderPage(this.currentPage);
      });
    }).catch((err: any) => {
      console.error('PDF load error:', err);
      this.ngZone.run(() => { this.isLoading = false; this.cd.detectChanges(); });
    });
  }

  renderPage(pageNum: number) {
    if (!this.pdfDoc) return;
    this.isLoading = true;
    this.cd.detectChanges();

    this.pdfDoc.getPage(pageNum).then((page: any) => {
      const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
      if (!canvas) return;

      const container = canvas.parentElement!;
      const maxW = container.clientWidth * 0.9;
      const maxH = container.clientHeight * 0.9;

      // Scale to fit the container
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
      });
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