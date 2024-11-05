import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
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
  styleUrl: './member-messages.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm!: NgForm;
  loading:boolean = false;
  messageContent = '';
  @Input() username!: string;

  constructor(public messageService:MessageService){}

  sendMessage() {
    if (!this.username) return;
    this.loading = true;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm?.reset();
    }).finally(() => this.loading = false);
  }
}
