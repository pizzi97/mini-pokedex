/**
 * Core domain and API type definitions for the Pokédex feature.
 *
 * Contains raw response node shapes matching the PokéAPI v2 GraphQL schema,
 * alongside clean domain models consumed across state stores, signals,
 * and presentation components.
 */

export interface PokemonStatNode {
  base_stat: number;
  pokemon_v2_stat: {
    name: string;
  };
}

export interface PokemonTypeNode {
  pokemon_v2_type: {
    name: string;
  };
}

export interface PokemonSpriteNode {
  sprites: string; // Restituito come stringa JSON da deserializzare
}

export interface PokemonAbilityNode {
  is_hidden: boolean;
  pokemon_v2_ability: {
    name: string;
    pokemon_v2_abilityeffecttexts: {
      short_effect: string;
    }[];
  };
}

export interface PokemonNode {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemontypes: PokemonTypeNode[];
  pokemon_v2_pokemonstats: PokemonStatNode[];
  pokemon_v2_pokemonsprites: PokemonSpriteNode[];
}

/**
 * Modello pulito dell'entità Pokémon usato all'interno dell'app (Signals, Store, UI).
 */
export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonAbility {
  name: string;
  effect: string;
  isHidden: boolean;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  stats: PokemonStat[];
  totalStats: number;
  spriteUrl: string;
}

export interface PokemonDetail extends Pokemon {
  abilities: PokemonAbility[];
}
