/**
 * Root container component for the catalog view.
 *
 * Coordinates data fetching, reactive filter bindings (search term and type filter),
 * client-side pagination, and navigation to detailed Pokémon views while leveraging
 * OnPush change detection for optimal rendering performance.
 */

import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PokemonStore } from '../../state/pokemon.store';
import { PokemonSelectors } from '../../state/pokemon.selectors';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokedex-page',
  standalone: true,
  imports: [CommonModule, AsyncPipe, PokemonCardComponent],
  templateUrl: './pokedex-page.component.html',
  styleUrl: './pokedex-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokedexPageComponent implements OnInit, OnDestroy {
  readonly store = inject(PokemonStore);
  readonly selectors = inject(PokemonSelectors);
  private readonly router = inject(Router);

  private fetchSub?: Subscription;

  readonly skeletons: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  readonly types: string[] = [
    'grass',
    'fire',
    'water',
    'bug',
    'normal',
    'poison',
    'electric',
    'ground',
    'fairy',
    'fighting',
    'psychic',
    'rock',
    'ghost',
    'ice',
    'dragon',
  ];

  currentPage = 1;
  private readonly pageSize = 20;

  ngOnInit(): void {
    this.fetchSub = this.selectors.fetchPokemon().subscribe();
  }

  ngOnDestroy(): void {
    this.fetchSub?.unsubscribe();
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.setSearchTerm(input.value);
  }

  onTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.store.setTypeFilter(select.value);
  }

  nextPage(): void {
    this.currentPage++;
    const offset = (this.currentPage - 1) * this.pageSize;
    this.store.setPagination(this.pageSize, offset);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      const offset = (this.currentPage - 1) * this.pageSize;
      this.store.setPagination(this.pageSize, offset);
    }
  }

  goToDetail(pokemonId: number): void {
    this.router.navigate(['/pokemon', pokemonId]);
  }
}
