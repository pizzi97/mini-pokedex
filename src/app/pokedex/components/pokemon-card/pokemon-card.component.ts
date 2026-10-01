import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Pokemon } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {
  pokemon = input.required<Pokemon>();
}
