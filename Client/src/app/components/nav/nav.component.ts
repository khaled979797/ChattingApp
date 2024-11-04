import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, CommonModule, RouterLink, HasRoleDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{
  model:any = {};

  constructor(public accountService:AccountService, private router:Router, private toastr:ToastrService){}

  ngOnInit(): void {
  }

  login(){
    this.accountService.login(this.model).subscribe({
      next: () => this.router.navigateByUrl('/members')
    });
  }
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
