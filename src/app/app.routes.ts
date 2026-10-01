/**
 * Root routing configuration for the application.
 *
 * Defines route definitions using lazy-loaded standalone components
 * for the Pokédex catalog, Pokémon detailed inspect view, and squad
 * management page, with a wildcard fallback redirecting to the catalog.
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pokedex/components/pokedex-page/pokedex-page.component').then(
        (m) => m.PokedexPageComponent,
      ),
  },
  {
    path: 'pokemon/:id',
    loadComponent: () =>
      import('./pokedex/components/pokemon-detail/pokemon-detail.component').then(
        (m) => m.PokemonDetailComponent,
      ),
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./teams/components/team-page/team-page.component').then((m) => m.TeamPageComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
