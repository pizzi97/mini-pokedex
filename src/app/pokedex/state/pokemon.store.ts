/**
 * Centralized client state store for the Pokémon catalog domain.
 *
 * Implements a hybrid reactive architecture using BehaviorSubjects for complex,
 * stream-composed query states (catalog lists, text search, type filters, pagination)
 * alongside Angular Signals for fine-grained UI view states (loading and error flags).
 */

import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from '../../core/models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonStore {
  private readonly pokemonListSubject = new BehaviorSubject<Pokemon[]>([]);
  private readonly searchSubject = new BehaviorSubject<string>('');
  private readonly typeFilterSubject = new BehaviorSubject<string>('');
  private readonly paginationSubject = new BehaviorSubject<{ limit: number; offset: number }>({
    limit: 20,
    offset: 0,
  });

  readonly pokemonList$ = this.pokemonListSubject.asObservable();
  readonly search$ = this.searchSubject.asObservable();
  readonly typeFilter$ = this.typeFilterSubject.asObservable();
  readonly pagination$ = this.paginationSubject.asObservable();

  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  setPokemonList(pokemon: Pokemon[]): void {
    this.pokemonListSubject.next(pokemon);
  }

  setSearchTerm(term: string): void {
    this.searchSubject.next(term);
  }

  setTypeFilter(type: string): void {
    this.typeFilterSubject.next(type);
  }

  setPagination(limit: number, offset: number): void {
    this.paginationSubject.next({ limit, offset });
  }

  setLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setError(errorMessage: string | null): void {
    this.error.set(errorMessage);
  }
}
