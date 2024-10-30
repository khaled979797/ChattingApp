import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';
import { authGuard } from './guards/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { LearnMoreComponent } from './components/learn-more/learn-more.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';

export const routes: Routes = [
  {path:'', component: HomeComponent},
  {
    path:'', runGuardsAndResolvers:'always', canActivate:[authGuard],
    children:
    [
      {path:'members', component: MemberListComponent},
      {path:'members/:username', component: MemberDetailComponent},
      {path:'member/edit', component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard]},
      {path:'lists', component: ListsComponent},
      {path:'messages', component: MessagesComponent}
    ]
  },
  {path:'learn-more', component: LearnMoreComponent},
  {path:'errors', component: TestErrorsComponent},
  {path:'server-error', component: ServerErrorComponent},
  {path:'not-found', component: NotFoundComponent},
  {path:'**', component: NotFoundComponent, pathMatch: 'full'}
];
