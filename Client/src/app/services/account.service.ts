import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IUser } from '../models/iuser';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSource = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http:HttpClient) { }

  login(model:any){
    return this.http.post<IUser>(environment.apiUrl + 'Account/Login', model).pipe(
      map((response: IUser) =>{
        if(response) this.setCurrentUser(response);
      })
    );
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
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
      map((response:IUser) =>{
        if(response) this.setCurrentUser(response);
      })
    )
  }

  getDecodedToken(token:string){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
