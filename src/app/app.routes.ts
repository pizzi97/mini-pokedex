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
    path: '**',
    redirectTo: '',
  },
];
