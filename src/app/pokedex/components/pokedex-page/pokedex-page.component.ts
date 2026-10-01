import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { PokemonStore } from '../../state/pokemon.store';
import { PokemonSelectors } from '../../state/pokemon.selectors';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokedex-page',
  standalone: true,
  // Importiamo la Card creata prima per poterla usare nell'HTML
  imports: [CommonModule, AsyncPipe, PokemonCardComponent],
  templateUrl: './pokedex-page.component.html',
  styleUrl: './pokedex-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokedexPageComponent implements OnInit, OnDestroy {
  readonly store = inject(PokemonStore);
  readonly selectors = inject(PokemonSelectors);
  private fetchSub?: Subscription;

  ngOnInit(): void {
    // Al caricamento del componente, avviamo il flusso dati RxJS per scaricare i Pokémon
    this.fetchSub = this.selectors.fetchPokemon().subscribe();
  }

  ngOnDestroy(): void {
    // Pulizia rigorosa per evitare memory leak
    this.fetchSub?.unsubscribe();
  }

  onSearchChange(event: Event): void {
    // Aggiorniamo il subject nello store ad ogni digitazione
    const input = event.target as HTMLInputElement;
    this.store.setSearchTerm(input.value);
  }
}
