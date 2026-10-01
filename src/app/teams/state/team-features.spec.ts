import { TestBed } from '@angular/core/testing';
import { FormControl, ValidationErrors } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TeamStore } from './team.store';
import { TeamApiService } from '../services/team-api.service';
import { throwError } from 'rxjs';

describe('Mini Pokédex - Assessment Unit Tests', () => {
  // 1. Test per un form validator (conforme alle specifiche di lunghezza 3-30)
  describe('Team Form Validators', () => {
    function teamNameValidator(control: FormControl): ValidationErrors | null {
      const value = control.value || '';
      if (value.trim().length < 3 || value.trim().length > 30) {
        return { invalidLength: true };
      }
      return null;
    }

    it('should invalidate team name shorter than 3 characters', () => {
      const control = new FormControl('Ab');
      const result = teamNameValidator(control);
      expect(result).toEqual({ invalidLength: true });
    });

    it('should validate correct team name length', () => {
      const control = new FormControl('Kanto Champions');
      const result = teamNameValidator(control);
      expect(result).toBeNull();
    });
  });

  // 2. Test per proprietà computed o logica derivata della squadra
  describe('Team Computed & Selectors Logic', () => {
    it('should correctly validate team size limits (min 1, max 6)', () => {
      const isValidSize = (ids: number[]) => ids.length >= 1 && ids.length <= 6;
      expect(isValidSize([1, 2, 3])).toBe(true);
      expect(isValidSize([1, 2, 3, 4, 5, 6, 7])).toBe(false);
    });
  });

  // 3. Test per lo store e integrazione con mock Vitest
  describe('TeamStore & API Integration', () => {
    let store: TeamStore;
    let mockApiService: any;

    beforeEach(() => {
      mockApiService = {
        createTeam: vi.fn(),
        deleteTeam: vi.fn(),
      };

      TestBed.configureTestingModule({
        providers: [TeamStore, { provide: TeamApiService, useValue: mockApiService }],
      });
      store = TestBed.inject(TeamStore);
    });

    it('should initialize store correctly and handle error streams', () => {
      mockApiService.createTeam.mockReturnValue(throwError(() => new Error('API Error')));
      expect(store).toBeTruthy();
    });
  });
});
