/**
 * Reactive selectors and asynchronous effect layer for the Pokémon catalog.
 *
 * Composes store state slices into optimized reactive streams using RxJS operators
 * (debounce, deduplication, multicasting), computes client-side filtered data, and
 * orchestrates network side effects with automatic cancellation of superseded requests.
 */

import { Injectable, inject } from '@angular/core';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  tap,
  catchError,
  of,
  Observable,
} from 'rxjs';
import { PokemonStore } from './pokemon.store';
import { PokemonApiService } from '../services/pokemon-api.service';
import { Pokemon } from '../../core/models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonSelectors {
  private readonly store = inject(PokemonStore);
  private readonly api = inject(PokemonApiService);

  readonly debouncedSearch$ = this.store.search$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    shareReplay(1),
  );

  readonly filteredPokemon$ = combineLatest([
    this.store.pokemonList$,
    this.debouncedSearch$,
    this.store.typeFilter$,
  ]).pipe(
    map(([pokemonList, searchTerm, typeFilter]) => {
      return pokemonList.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter ? p.types.includes(typeFilter) : true;
        return matchesSearch && matchesType;
      });
    }),
    shareReplay(1),
  );

  fetchPokemon(): Observable<Pokemon[]> {
    this.store.setLoading(true);
    this.store.setError(null);

    return this.store.pagination$.pipe(
      switchMap((pagination) =>
        this.api.getPokemonList(pagination.limit, pagination.offset).pipe(
          tap((data) => {
            this.store.setPokemonList(data);
            this.store.setLoading(false);
          }),
          catchError(() => {
            this.store.setError('Network error loading Pokémon. Please try again.');
            this.store.setLoading(false);
            return of([]);
          }),
        ),
      ),
    );
  }
}
