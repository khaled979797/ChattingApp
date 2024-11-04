import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { RouterLink } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { IsUserDirective } from '../../directives/is-user.directive';
import { IUser } from '../../models/iuser';
import { take } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent, RouterLink, IsUserDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  registerMode: boolean = false;

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event:boolean){
    this.registerMode = event;
  }
}
