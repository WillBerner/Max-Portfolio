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
      image: 'assets/images/riverside-house.svg',
    },
    {
      title: 'Modern Loft',
      image: 'assets/images/modern-loft.svg',
    },
    {
      title: 'Studio Renovation',
      image: 'assets/images/studio-renovation.svg',
    },
  ];
}
