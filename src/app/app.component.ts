/**
 * Root component serving as the primary presentation shell of the application.
 *
 * Configured as a standalone component that imports routing capabilities
 * (RouterOutlet and RouterModule) to host the top navigation bar and dynamic feature views.
 */

import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mini-pokedex';
}
