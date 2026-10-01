import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TeamStore } from '../../state/team.store';
import { PokemonCardComponent } from '../../../pokedex/components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PokemonCardComponent],
  templateUrl: './team-page.component.html',
  styleUrl: './team-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamPageComponent {
  readonly teamStore = inject(TeamStore);
  private readonly router = inject(Router);

  goToDetail(pokemonId: number): void {
    this.router.navigate(['/pokemon', pokemonId]);
  }
}
