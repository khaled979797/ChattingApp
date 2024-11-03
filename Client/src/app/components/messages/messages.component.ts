import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { IMessage } from '../../models/imessage';
import { IPagination } from '../../models/ipagination';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterLink } from '@angular/router';
import { TimeagoModule } from 'ngx-timeago';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule, ButtonsModule, PaginationModule, RouterLink, TimeagoModule, CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  messages!:IMessage[];
  pagination!:IPagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading: boolean = false;

  constructor(private messageService:MessageService){}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response =>{
      this.pagination = <IPagination>response.pagination;
      this.messages = <IMessage[]>response.result;
      this.loading = false;
    });
  }

  pageChanged(event:any){
    if(this.pageNumber !== event.page){
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

  deleteMessage(id:number){
    this.messageService.deleteMessage(id).subscribe(() =>{
      this.messages.splice(this.messages.findIndex(x => x.id === id), 1);
    });
  }
}
