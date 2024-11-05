import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { getPaginationHeaders, getPaginatedResult } from './paginationHelper';
import { IMessage } from '../models/imessage';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { IUser } from '../models/iuser';
import { BehaviorSubject, take } from 'rxjs';
import { error } from 'console';
import { IGroup } from '../models/igroup';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private hubConnection!:HubConnection;
  private messageThreadSource = new BehaviorSubject<IMessage[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http:HttpClient) { }

  getMessages(pageNumber: number, pageSize:number, container:string){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('container', container);

    return getPaginatedResult<IMessage[]>(environment.apiUrl + 'Message/GetMessages', params, this.http);
  }

  getMessageThread(username:string){
    return this.http.get<IMessage[]>(environment.apiUrl + `Message/GetMessageThread/${username}`);
  }

  async sendMessage(username: string, content: string) {
    let messageObj = {recipientUsername: username, content}
    return this.hubConnection?.invoke('CreateMessage', messageObj)
      .catch(error => console.log(error));
  }

  deleteMessage(id:number){
    return this.http.delete<IMessage>(environment.apiUrl + `Message/DeleteMessage/${id}`);
  }

  createHubConnection(user:IUser, otherUsername:string){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.hubUrl + `Message?user=${otherUsername}`, {
        accessTokenFactory: () => user.token
      }).withAutomaticReconnect().build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('ReceivedMessageThread', messages =>{
      this.messageThreadSource.next(messages)
    });

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages =>{
        this.messageThreadSource.next([...messages, message])
      })
    });

    this.hubConnection.on('UpdatedGroup', (group:IGroup) =>{
      if(group.connections.some(x => x.username === otherUsername)){
        this.messageThread$.pipe(take(1)).subscribe(messages =>{
          messages.forEach(msg =>{
            if(!msg.dateRead){
              msg.dateRead = new Date(Date.now())
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    });
  }

  stopHubConnection(){
    if(this.hubConnection){
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }
}
