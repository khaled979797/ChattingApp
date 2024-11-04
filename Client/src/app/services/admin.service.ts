import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../models/iuser';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  getUsersWithRoles(){
    return this.http.get<IUser[]>(environment.apiUrl + 'Admin/UsersWithRoles');
  }

  updateUserRoles(username:string, roles:string[]){
    return this.http.post(environment.apiUrl + `Admin/EditRoles/${username}?roles=${roles}`, {});
  }
}
