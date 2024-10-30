import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMember } from '../models/imember';
import { environment } from '../../environments/environment.development';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  members:IMember[] = [];

  constructor(private http:HttpClient) {}

  getMembers(){
    if(this.members.length > 0) return of(this.members);
    return this.http.get<IMember[]>(environment.apiUrl + 'User/Users').pipe(
      map(members =>{
        this.members = members;
        return members;
      })
    );
  }

  getMember(username:string){
    const member = this.members.find(x => x.userName === username);
    if(member !== undefined) return of(member);
    return this.http.get<IMember>(environment.apiUrl + `User/${username}`);
  }

  updateMember(member:IMember){
    return this.http.put(environment.apiUrl + 'User/UpdateUser', member).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
