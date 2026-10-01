import { Injectable, computed, signal } from '@angular/core';
import { Pokemon } from '../../core/models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class TeamStore {
  private readonly _team = signal<Pokemon[]>([]);

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
    this._team.update((currentTeam) => [...currentTeam, pokemon]);
  }

  removeFromTeam(pokemonId: number): void {
    this._team.update((currentTeam) => currentTeam.filter((p) => p.id !== pokemonId));
  }

  isInTeam(pokemonId: number): boolean {
    return this._team().some((p) => p.id === pokemonId);
  }
}
