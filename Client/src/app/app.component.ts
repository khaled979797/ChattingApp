import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IUser } from './models/iuser';
import { AccountService } from './services/account.service';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from "./components/home/home.component";
import bootstrap from '../main.server';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { PresenceService } from './services/presence.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FormsModule, HomeComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(private accountService:AccountService, private presence: PresenceService){}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    if(typeof(localStorage) !== "undefined"){
      const userString = localStorage.getItem('user');
      if (!userString) return;
      const user: IUser = JSON.parse(userString);
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }
  }
}
