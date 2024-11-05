import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ImagesGalleryComponent } from "../images-gallery/images-gallery.component";
import { CommonModule } from '@angular/common';
import { TimeagoModule } from "ngx-timeago";
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { ToastrService } from 'ngx-toastr';
import { IMember } from '../../../models/imember';
import { IMessage } from '../../../models/imessage';
import { MembersService } from '../../../services/members.service';
import { MessageService } from '../../../services/message.service';
import { PresenceService } from '../../../services/presence.service';
import { AccountService } from '../../../services/account.service';
import { IUser } from '../../../models/iuser';
import { take } from 'rxjs';;


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, ImagesGalleryComponent, CommonModule, TimeagoModule, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
  providers: []
})
export class MemberDetailComponent implements OnInit, OnDestroy{
  member: IMember = {} as IMember;
  @ViewChild('memberTabs', {static:true}) memberTabs!:TabsetComponent;
  activeTab!:TabDirective;
  user!:IUser;

  constructor(private membersService:MembersService, private activatedRoute:ActivatedRoute,
    private messageService:MessageService, private toastr:ToastrService,
    public presence:PresenceService, private accountService:AccountService, private router:Router){
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = <IUser>user);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }


  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data =>{
      this.member = data['member'];
    });
    this.activatedRoute.queryParams.subscribe(params =>{
      params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0);
    })
  }

  loadMessages(){
    this.messageService.createHubConnection(this.user, this.member.userName);
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.user) {
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  selectTab(tabId:number){
    if(this.memberTabs){
      this.memberTabs.tabs[tabId].active = true;
    }
  }

  addLike(){
    this.membersService.addLike(this.member.userName).subscribe(() =>{
      this.toastr.success(`You have liked ${this.member.knownAs}`)
    })
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
