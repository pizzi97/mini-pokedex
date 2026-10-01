/**
 * Data access service interfacing with the external PokéAPI GraphQL endpoint.
 *
 * Executes parameterized queries for catalog pagination and ability metadata,
 * applies automatic retry strategies for network resiliency, and transforms
 * raw GraphQL response nodes into normalized client domain models.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, retry } from 'rxjs';
import { Pokemon, PokemonAbility, PokemonNode } from '../../core/models/pokemon.model';

const POKEAPI_URL = 'https://beta.pokeapi.co/graphql/v1beta';

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

  getPokemonList(limit: number = 20, offset: number = 0): Observable<Pokemon[]> {
    return this.http
      .post<{ data: { pokemon_v2_pokemon: PokemonNode[] } }>(POKEAPI_URL, {
        query: GET_POKEMON_QUERY,
        variables: { limit, offset },
      })
      .pipe(
        retry({ count: 3, delay: 1000 }),
        map((response) =>
          response.data.pokemon_v2_pokemon.map((node) => this.mapPokemonNode(node)),
        ),
      );
  }

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

  private mapPokemonNode(node: PokemonNode): Pokemon {
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.id}.png`;

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
