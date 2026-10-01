/**
 * Data contracts and payload schemas for squad management.
 *
 * Defines the core structure of a user's Pokémon squad, including
 * trainer association and roster identifiers, alongside transmission
 * payloads for squad creation and persistence.
 */

export interface Team {
  id: number;
  trainer_id: number;
  name: string;
  pokemon_ids: number[];
  created_at: string;
}

export interface CreateTeamPayload {
  trainer_id: number;
  name: string;
  pokemon_ids: number[];
}
