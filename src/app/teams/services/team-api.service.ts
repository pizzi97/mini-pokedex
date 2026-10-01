/**
 * Data access service interfacing with the local GraphQL squad mock server.
 *
 * Executes queries and mutations for squad persistence, handling operations
 * such as retrieving all squads, creating new squads with automatic identifier
 * generation, and deleting squads by ID.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Team, CreateTeamPayload } from '../../core/models/team.model';

const MOCK_API_URL = 'http://localhost:4000';

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

  getTeams(): Observable<Team[]> {
    return this.http
      .post<{ data: { allTeams: Team[] } }>(MOCK_API_URL, {
        query: GET_TEAMS_QUERY,
      })
      .pipe(map((response) => response.data.allTeams));
  }

  createTeam(payload: CreateTeamPayload): Observable<Team> {
    return this.http
      .post<{ data: { createTeam: Team } }>(MOCK_API_URL, {
        query: CREATE_TEAM_MUTATION,
        variables: payload,
      })
      .pipe(map((response) => response.data.createTeam));
  }

  deleteTeam(id: number): Observable<boolean> {
    return this.http
      .post<{ data: { removeTeam: { id: string } } }>(MOCK_API_URL, {
        query: DELETE_TEAM_MUTATION,
        variables: { id: id.toString() },
      })
      .pipe(map(() => true));
  }
}
