import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, ImagesGalleryComponent, CommonModule, TimeagoModule, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit{
  member!:IMember;
  @ViewChild('memberTabs', {static:true}) memberTabs!:TabsetComponent;
  activeTab!:TabDirective;
  messages:IMessage[] = [];

  constructor(private membersService:MembersService, private activatedRoute:ActivatedRoute,
    private messageService:MessageService, private toastr:ToastrService){}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data =>{
      this.member = data['member'];
    });
    this.activatedRoute.queryParams.subscribe(params =>{
      params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0);
    })
  }

  loadMember(){
    this.membersService.getMember(<string>this.activatedRoute.snapshot.paramMap.get('username'))
      .subscribe(response => this.member = response);
  }

  loadMessages(){
    this.messageService.getMessageThread(this.member.userName).subscribe(messages=>{
      this.messages = messages;
    })
  }

  onTabActivated(data:TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading == 'Messages' && this.messages.length === 0){
      this.loadMessages();
    }
  }

  selectTab(tabId:number){
    this.memberTabs.tabs[tabId].active = true;
  }

  addLike(){
    this.membersService.addLike(this.member.userName).subscribe(() =>{
      this.toastr.success(`You have liked ${this.member.knownAs}`)
    })
  }
}
