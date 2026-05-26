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
}
