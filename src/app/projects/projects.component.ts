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
      id: 'modern-loft',
      title: 'Modern Loft',
      description: 'POD A+D VENICE BIENNIAL\n3D PRINTED MODEL',
      image: 'assets/images/POD A+D Model 15.png',
    },
    {
      id: 'studio-renovation',
      title: 'Studio Renovation',
      description: 'A CENTER FOR THE BUILT ENVIRONMENT\nRAMMED EARTH MODEL',
      image: 'assets/images/Rammed Earth Model.JPG',
    },
    {
      id: 'riverside-house',
      title: 'Riverside House',
      description: 'A CENTER FOR THE BUILT ENVIRONMENT\nEXTERIOR RENDER',
      image: 'assets/images/Street View.png',
    },
  ];
}
