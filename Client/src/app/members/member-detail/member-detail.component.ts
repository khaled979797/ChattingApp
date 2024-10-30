import { Component, OnInit } from '@angular/core';
import { IMember } from '../../models/imember';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ImagesGalleryComponent } from "../images-gallery/images-gallery.component";


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, ImagesGalleryComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit{
  member!:IMember;

  constructor(private membersService:MembersService, private activatedRoute:ActivatedRoute){}

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.membersService.getMember(<string>this.activatedRoute.snapshot.paramMap.get('username')).subscribe(response => this.member = response);
    }
}
