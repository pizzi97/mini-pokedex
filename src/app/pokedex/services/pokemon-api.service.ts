import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, retry } from 'rxjs';
import { Pokemon, PokemonAbility, PokemonNode } from '../../core/models/pokemon.model';

// Costanti
const POKEAPI_URL = 'https://beta.pokeapi.co/graphql/v1beta';

// Query esatte richieste dalle specifiche del task
const GET_POKEMON_QUERY = `
  query GetPokemon($limit: Int, $offset: Int) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset) {
      id
      name
      height
      weight
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

const GET_ABILITIES_QUERY = `
  query GetAbilities($pokemonId: Int) {
    pokemon_v2_pokemonability(where: { pokemon_id: { _eq: $pokemonId } }) {
      pokemon_v2_ability {
        name
        pokemon_v2_abilityeffecttexts(where: { language_id: { _eq: 9 } }) {
          short_effect
        }
      }
      is_hidden
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class PokemonApiService {
  private readonly http = inject(HttpClient);

  /**
   * Recupera la lista paginata dei Pokémon e applica un retry pattern.
   */
  getPokemonList(limit: number = 20, offset: number = 0): Observable<Pokemon[]> {
    return this.http
      .post<{ data: { pokemon_v2_pokemon: PokemonNode[] } }>(POKEAPI_URL, {
        query: GET_POKEMON_QUERY,
        variables: { limit, offset },
      })
      .pipe(
        // Requisito di resilienza: retry in caso di fallimento di rete
        retry({ count: 3, delay: 1000 }),
        map((response) =>
          response.data.pokemon_v2_pokemon.map((node) => this.mapPokemonNode(node)),
        ),
      );
  }

  /**
   * Recupera le abilità di un singolo Pokémon.
   */
  getPokemonAbilities(pokemonId: number): Observable<PokemonAbility[]> {
    return this.http
      .post<{ data: { pokemon_v2_pokemonability: any[] } }>(POKEAPI_URL, {
        query: GET_ABILITIES_QUERY,
        variables: { pokemonId },
      })
      .pipe(
        retry({ count: 3, delay: 1000 }),
        map((response) =>
          response.data.pokemon_v2_pokemonability.map((node) => ({
            name: node.pokemon_v2_ability.name,
            effect:
              node.pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0]?.short_effect ||
              'No description available.',
            isHidden: node.is_hidden,
          })),
        ),
      );
  }

  /**
   * Utility privata per mappare i DTO complessi in entità pulite
   */
  private mapPokemonNode(node: PokemonNode): Pokemon {
    // Parsing sicuro dello sprite JSON
    let spriteUrl = '';
    try {
      const spritesParsed = JSON.parse(node.pokemon_v2_pokemonsprites[0]?.sprites || '{}');
      spriteUrl = spritesParsed.front_default || '';
    } catch {
      spriteUrl = '';
    }

    // Estrazione pulita delle statistiche
    const stats = node.pokemon_v2_pokemonstats.map((s) => ({
      name: s.pokemon_v2_stat.name,
      value: s.base_stat,
    }));
    const totalStats = stats.reduce((acc, stat) => acc + stat.value, 0);

    return {
      id: node.id,
      name: node.name,
      height: node.height,
      weight: node.weight,
      types: node.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name),
      stats,
      totalStats,
      spriteUrl,
    };
  }
}
