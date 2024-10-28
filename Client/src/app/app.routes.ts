import { Routes } from '@angular/router';
import { HomeComponent } from './compoents/home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './compoents/lists/lists.component';
import { MessagesComponent } from './compoents/messages/messages.component';
import { NotFoundComponent } from './compoents/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path:'', component: HomeComponent},
  {
    path:'', runGuardsAndResolvers:'always', canActivate:[authGuard],
    children:
    [
      {path:'members', component: MemberListComponent},
      {path:'members/:id', component: MemberDetailComponent},
      {path:'lists', component: ListsComponent},
      {path:'messages', component: MessagesComponent}
    ]
  },
  {path:'**', component: NotFoundComponent, pathMatch: 'full'}
];
