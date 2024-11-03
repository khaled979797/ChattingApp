import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { getPaginationHeaders, getPaginatedResult } from './paginationHelper';
import { IMessage } from '../models/imessage';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http:HttpClient) { }

  getMessages(pageNumber: number, pageSize:number, container:string){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('container', container);

    return getPaginatedResult<IMessage[]>(environment.apiUrl + 'Message/GetMessages', params, this.http);
  }

  getMessageThread(username:string){
    return this.http.get<IMessage[]>(environment.apiUrl + `Message/GetMessageThread/${username}`);
  }

  sendMessage(username:string, content: string){
    return this.http.post<IMessage>(environment.apiUrl + `Message/CreateMessage`, {recipientUsername: username, content});
  }

  deleteMessage(id:number){
    return this.http.delete<IMessage>(environment.apiUrl + `Message/DeleteMessage/${id}`);
  }
}
