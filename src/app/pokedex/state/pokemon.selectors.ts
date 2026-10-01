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

  /**
   * 1. Flusso di Ricerca Ottimizzato.
   * - debounceTime(300): attende 300ms di inattività prima di emettere il valore (evita calcoli a ogni singola lettera digitata).
   * - distinctUntilChanged: blocca l'emissione se la parola cercata è identica alla precedente.
   * - shareReplay(1): memorizza l'ultimo valore per i nuovi iscritti, evitando memory leak.
   */
  readonly debouncedSearch$ = this.store.search$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    shareReplay(1),
  );

  /**
   * 2. Dati Derivati (Selettore Paginato e Filtrato).
   * Ascolta simultaneamente i dati originali, la ricerca ottimizzata e il filtro a tendina.
   * Ricalcola la lista finale da mostrare nella UI solo quando uno di questi tre cambia.
   */
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

  /**
   * 3. Orchestrazione Rete (Effetto).
   * Quando la paginazione cambia, avvia la chiamata HTTP.
   * - switchMap: fondamentale qui. Se l'utente clicca "Avanti" due volte velocemente,
   *   annulla la prima richiesta HTTP e tiene valida solo l'ultima.
   */
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
          catchError((error) => {
            this.store.setError('Network error loading Pokémon. Please try again.');
            this.store.setLoading(false);
            return of([]); // Completa il flusso senza far "esplodere" la subscription
          }),
        ),
      ),
    );
  }
}
