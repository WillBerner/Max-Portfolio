import { Component } from '@angular/core';
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
  sampleProjects = [
    {
      title: 'Riverside House',
      image:
        'https://images.unsplash.com/photo-1505842465776-3d32a1f4b7c9?w=1200&auto=format&fit=crop&q=80',
    },
    {
      title: 'Modern Loft',
      image:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&auto=format&fit=crop&q=80',
    },
    {
      title: 'Studio Renovation',
      image:
        'https://images.unsplash.com/photo-1505691723518-36a0f6a0f2f9?w=1200&auto=format&fit=crop&q=80',
    },
  ];
}
