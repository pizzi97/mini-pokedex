/**
 * Entità Team memorizzata nel server GraphQL locale.
 */
export interface Team {
  id: number;
  trainer_id: number;
  name: string;
  pokemon_ids: number[];
  created_at: string;
}

/**
 * Payload per la creazione di un nuovo team (senza ID gestito dal backend).
 */
export interface CreateTeamPayload {
  trainer_id: number;
  name: string;
  pokemon_ids: number[];
}
