import { Injectable, signal, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Team, CreateTeamPayload } from '../../core/models/team.model';
import { TeamApiService } from '../services/team-api.service';

@Injectable({ providedIn: 'root' })
export class TeamStore {
  private readonly api = inject(TeamApiService);

  // 1. Core State
  private readonly teamsSubject = new BehaviorSubject<Team[]>([]);
  readonly teams$ = this.teamsSubject.asObservable();

  // 2. UI State (Signals)
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Caricamento standard delle squadre
   */
  loadTeams(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.api.getTeams().subscribe({
      next: (teams) => {
        this.teamsSubject.next(teams);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Network error while loading teams.');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Creazione con Optimistic Update e Rollback
   */
  addTeamOptimistic(payload: CreateTeamPayload): void {
    const currentTeams = this.teamsSubject.getValue();

    // FASE 1: Creiamo un'entità temporanea e aggiorniamo subito la UI
    const tempTeam: Team = {
      ...payload,
      id: Date.now(), // ID fittizio temporaneo
      created_at: new Date().toISOString(),
    };
    this.teamsSubject.next([...currentTeams, tempTeam]);
    this.error.set(null);

    // FASE 2: Chiamata di rete asincrona
    this.api.createTeam(payload).subscribe({
      next: (realTeam) => {
        // Successo: Sostituiamo il team temporaneo con quello confermato dal server (ID reale)
        const updatedTeams = this.teamsSubject
          .getValue()
          .map((t) => (t.id === tempTeam.id ? realTeam : t));
        this.teamsSubject.next(updatedTeams);
      },
      error: (err) => {
        // FASE 3: Fallimento - Eseguiamo il Rollback allo stato precedente
        this.error.set('Failed to save the team. State rolled back.');
        this.teamsSubject.next(currentTeams);
      },
    });
  }

  /**
   * Cancellazione con Optimistic Update e Rollback
   */
  deleteTeamOptimistic(id: number): void {
    const currentTeams = this.teamsSubject.getValue();

    // FASE 1: Rimuoviamo subito il team dalla UI
    this.teamsSubject.next(currentTeams.filter((t) => t.id !== id));
    this.error.set(null);

    // FASE 2: Chiamata di rete asincrona
    this.api.deleteTeam(id).subscribe({
      next: () => {
        // Successo: Non facciamo nulla, la UI è già aggiornata
      },
      error: (err) => {
        // FASE 3: Fallimento - Eseguiamo il Rollback ripristinando il team eliminato
        this.error.set('Failed to delete the team. Item restored.');
        this.teamsSubject.next(currentTeams);
      },
    });
  }
}
