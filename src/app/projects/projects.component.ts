import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-projects',
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent {
  projects = [
    {
      id: 'riverside-house',
      title: 'Riverside House',
      description: 'A quiet riverside retreat with large glass facades.',
      image:
        'https://images.unsplash.com/photo-1505842465776-3d32a1f4b7c9?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'modern-loft',
      title: 'Modern Loft',
      description: 'Industrial loft conversion with minimalist finishes.',
      image:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'studio-renovation',
      title: 'Studio Renovation',
      description: 'Compact studio optimized for light and storage.',
      image:
        'https://images.unsplash.com/photo-1505691723518-36a0f6a0f2f9?w=1200&auto=format&fit=crop&q=80',
    },
  ];
}
