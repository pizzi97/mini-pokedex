import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Team, CreateTeamPayload } from '../../core/models/team.model';

const MOCK_API_URL = 'http://localhost:4000';

// Le query e mutazioni standard generate da json-graphql-server
const GET_TEAMS_QUERY = `
  query GetTeams {
    allTeams {
      id
      trainer_id
      name
      pokemon_ids
      created_at
    }
  }
`;

const CREATE_TEAM_MUTATION = `
  mutation CreateTeam($trainer_id: Int!, $name: String!, $pokemon_ids: [Int]!, $created_at: String!) {
    createTeam(trainer_id: $trainer_id, name: $name, pokemon_ids: $pokemon_ids, created_at: $created_at) {
      id
      trainer_id
      name
      pokemon_ids
      created_at
    }
  }
`;

const DELETE_TEAM_MUTATION = `
  mutation DeleteTeam($id: ID!) {
    removeTeam(id: $id) {
      id
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class TeamApiService {
  private readonly http = inject(HttpClient);

  /**
   * Recupera tutte le squadre dal mock server locale.
   */
  getTeams(): Observable<Team[]> {
    return this.http
      .post<{ data: { allTeams: Team[] } }>(MOCK_API_URL, {
        query: GET_TEAMS_QUERY,
      })
      .pipe(map((response) => response.data.allTeams));
  }

  /**
   * Crea una nuova squadra.
   * Il server mock genererà e restituirà automaticamente l'ID assegnato.
   */
  createTeam(payload: CreateTeamPayload): Observable<Team> {
    return this.http
      .post<{ data: { createTeam: Team } }>(MOCK_API_URL, {
        query: CREATE_TEAM_MUTATION,
        variables: payload,
      })
      .pipe(map((response) => response.data.createTeam));
  }

  /**
   * Elimina una squadra tramite il suo ID.
   */
  deleteTeam(id: number): Observable<boolean> {
    return this.http
      .post<{ data: { removeTeam: { id: string } } }>(MOCK_API_URL, {
        query: DELETE_TEAM_MUTATION,
        // GraphQL si aspetta che gli identificatori di tipo ID! siano stringhe nelle variabili
        variables: { id: id.toString() },
      })
      .pipe(map(() => true));
  }
}
