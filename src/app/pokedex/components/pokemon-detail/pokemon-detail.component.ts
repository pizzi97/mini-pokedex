/**
 * Detailed view container component for a single Pokémon entity.
 *
 * Resolves route parameters to hydrate Pokémon details from the local store,
 * asynchronously fetches extended ability metadata via GraphQL, provides
 * squad membership toggling, and handles historical back-navigation.
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule, Location, TitleCasePipe, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { PokemonStore } from '../../state/pokemon.store';
import { PokemonApiService } from '../../services/pokemon-api.service';
import { Pokemon, PokemonAbility } from '../../../core/models/pokemon.model';
import { TeamStore } from '../../../teams/state/team.store';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, NgOptimizedImage],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(PokemonStore);
  private readonly api = inject(PokemonApiService);
  private readonly location = inject(Location);
  readonly teamStore = inject(TeamStore);

  readonly pokemon = signal<Pokemon | null>(null);
  readonly abilities = signal<PokemonAbility[]>([]);
  readonly isLoadingAbilities = signal<boolean>(false);

  private sub?: Subscription;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.sub = this.store.pokemonList$.pipe(first()).subscribe((list) => {
      const found = list.find((p) => p.id === id);
      if (found) {
        this.pokemon.set(found);
      }
    });

    this.isLoadingAbilities.set(true);
    this.api.getPokemonAbilities(id).subscribe({
      next: (data) => {
        this.abilities.set(data);
        this.isLoadingAbilities.set(false);
      },
      error: () => this.isLoadingAbilities.set(false),
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleTeamStatus(pokemon: Pokemon): void {
    if (this.teamStore.isInTeam(pokemon.id)) {
      this.teamStore.removeFromTeam(pokemon.id);
    } else {
      this.teamStore.addToTeam(pokemon);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
