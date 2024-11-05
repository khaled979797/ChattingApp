import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IUser } from '../models/iuser';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { json } from 'stream/consumers';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSource = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http:HttpClient, private presence: PresenceService) { }

  login(model:any){
    return this.http.post<IUser>(environment.apiUrl + 'Account/Login', model).pipe(
      map((user: IUser) =>{
        if(user) this.setCurrentUser(user);
        this.presence.createHubConnection(user);
      })
    );
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  setCurrentUser(user:IUser){
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  register(model: any){
    return this.http.post<IUser>(environment.apiUrl + 'Account/Register', model).pipe(
      map((user:IUser) =>{
        if(user) this.setCurrentUser(user);
        this.presence.createHubConnection(user);
      })
    )
  }

  getDecodedToken(token:string){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
