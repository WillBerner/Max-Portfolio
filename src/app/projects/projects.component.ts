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
      image: 'assets/images/Street View.png',
    },
    {
      id: 'modern-loft',
      title: 'Modern Loft',
      description: 'Industrial loft conversion with minimalist finishes.',
      image: 'assets/images/POD A+D Model 15.png',
    },
    {
      id: 'studio-renovation',
      title: 'Studio Renovation',
      description: 'Compact studio optimized for light and storage.',
      image: 'assets/images/Rammed Earth Model.JPG',
    },
  ];
}
