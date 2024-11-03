import { Component, OnInit } from '@angular/core';
import { MemberCardComponent } from "../member-card/member-card.component";
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { IMember } from '../../../models/imember';
import { IPagination } from '../../../models/ipagination';
import { UserParams } from '../../../models/user-params';
import { IUser } from '../../../models/iuser';
import { MembersService } from '../../../services/members.service';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, PaginationModule, FormsModule, ButtonsModule, MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit{
  members?:IMember[];
  pagination?:IPagination;
  userParams!:UserParams;
  user!:IUser;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]

  constructor(private membersService:MembersService){
    this.userParams = this.membersService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.membersService.setUserParams(this.userParams);
    this.membersService.getMembers(this.userParams).subscribe(response =>{
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event:any){
    this.userParams.pageNumber = event.page;
    this.membersService.setUserParams(this.userParams);
    this.loadMembers();
  }

  resetFilters(){
    this.userParams = this.membersService.resetUserParams();
    this.loadMembers();
  }
}
