import { Component, OnInit } from '@angular/core';
import { IMember } from '../../models/imember';
import { MembersService } from '../../services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, CommonModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit{
  members$?:Observable<IMember[]>;

  constructor(private membersService:MembersService){}

  ngOnInit(): void {
    this.members$ = this.membersService.getMembers();
  }
}
