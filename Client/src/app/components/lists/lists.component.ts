import { Component, OnInit } from '@angular/core';
import { IMember } from '../../models/imember';
import { MembersService } from '../../services/members.service';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from "../../members/member-card/member-card.component";
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { IPagination } from '../../models/ipagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [FormsModule, MemberCardComponent, ButtonsModule, PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit{
  members!:IMember[];
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination!: IPagination;

  constructor(private membersService:MembersService) {}

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.membersService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response =>{
      this.members = <IMember[]>response.result;
      this.pagination = <IPagination>response.pagination;
    })
  }

  pageChanged(event:any){
    this.pageNumber = event.page;
    this.loadLikes();
  }
}
