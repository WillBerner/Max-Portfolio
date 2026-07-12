import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal("Max's Portfolio");
}
