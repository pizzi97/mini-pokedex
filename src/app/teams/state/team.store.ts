/**
 * State store managing squad roster composition and client-side persistence.
 *
 * Utilizes Angular Signals and computed values to enforce team size constraints
 * (maximum 6 members), prevent duplicate entries, and synchronize state changes
 * with browser local storage.
 */

import { Injectable, computed, signal } from '@angular/core';
import { Pokemon } from '../../core/models/pokemon.model';

const TEAM_STORAGE_KEY = 'mini_pokedex_team';

@Injectable({ providedIn: 'root' })
export class TeamStore {
  private readonly _team = signal<Pokemon[]>(this.loadTeamFromStorage());

  readonly team = this._team.asReadonly();
  readonly isTeamFull = computed(() => this._team().length >= 6);

  addToTeam(pokemon: Pokemon): void {
    if (this.isTeamFull()) {
      alert('Your team is already full! (Max 6 Pokémon)');
      return;
    }
    if (this.isInTeam(pokemon.id)) {
      alert(`${pokemon.name} is already in your team!`);
      return;
    }

    this._team.update((currentTeam) => {
      const newTeam = [...currentTeam, pokemon];
      this.saveTeamToStorage(newTeam);
      return newTeam;
    });
  }

  removeFromTeam(pokemonId: number): void {
    this._team.update((currentTeam) => {
      const newTeam = currentTeam.filter((p) => p.id !== pokemonId);
      this.saveTeamToStorage(newTeam);
      return newTeam;
    });
  }

  isInTeam(pokemonId: number): boolean {
    return this._team().some((p) => p.id === pokemonId);
  }

  private loadTeamFromStorage(): Pokemon[] {
    try {
      const stored = localStorage.getItem(TEAM_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      console.error('Failed to parse team from localStorage');
      return [];
    }
  }

  private saveTeamToStorage(team: Pokemon[]): void {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
    } catch {
      console.error('Failed to save team to localStorage');
    }
  }
}
