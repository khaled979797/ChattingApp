import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { IMessage } from '../../../models/imessage';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeagoModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit{
  @ViewChild('messageForm') messageForm!: NgForm;
  @Input() messages!:IMessage[];
  loading:boolean = false;
  messageContent = '';
  @Input() username!: string;

  constructor(public messageService:MessageService){}

  ngOnInit(): void {
  }

  sendMessage(){
    this.messageService.sendMessage(this.username, this.messageContent).subscribe(message =>{
      this.messages.push(message);
      this.messageForm.reset();
    });
  }
}
