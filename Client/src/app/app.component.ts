import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IUser } from './models/iuser';
import { AccountService } from './services/account.service';
import { NavComponent } from './compoents/nav/nav.component';
import { HomeComponent } from "./compoents/home/home.component";
import bootstrap from '../main.server';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FormsModule, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(private accountService:AccountService){}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(){
    const user:IUser = JSON.parse(<string>localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }
}
