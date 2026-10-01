/**
 * Presentational card component for an individual Pokémon entry.
 *
 * Implements modern Angular signal-based inputs and outputs to expose
 * a read-only entity display, delegating selection events to parent containers
 * under an OnPush change detection strategy.
 */

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { Pokemon } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, NgOptimizedImage],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {
  readonly pokemon = input.required<Pokemon>();
  readonly priority = input<boolean>(false);
  readonly cardClick = output<number>();
}
