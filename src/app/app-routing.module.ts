import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   { path: 'home', loadChildren: './home/home.module#HomePageModule' },
//   { path: 'todo-details', loadChildren: './pages/todo-details/todo-details.module#TodoDetailsPageModule' },
//   { path: 'idea-list', loadChildren: './pages/idea-list/idea-list.module#IdeaListPageModule' },
//   { path: 'idea-details', loadChildren: './pages/idea-details/idea-details.module#IdeaDetailsPageModule' },
// ];

const routes: Routes = [
  { path: '', loadChildren: './pages/idea-list/idea-list.module#IdeaListPageModule' },
  { path: 'pro', loadChildren: './pages/idea-details/idea-details.module#IdeaDetailsPageModule' },
  { path: 'pro/:id', loadChildren: './pages/idea-details/idea-details.module#IdeaDetailsPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
