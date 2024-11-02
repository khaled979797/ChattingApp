import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMember } from '../models/imember';
import { environment } from '../../environments/environment.development';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../models/paginated-result';
import { UserParams } from '../models/user-params';
import { AccountService } from './account.service';
import { IUser } from '../models/iuser';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  members:IMember[] = [];
  memberCache = new Map();
  user!:IUser;
  userParams!:UserParams;

  constructor(private http:HttpClient, private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
      this.user = <IUser>user;
      this.userParams = new UserParams(this.user);
    })
  }

  getMembers(userParams:UserParams){
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<IMember[]>(environment.apiUrl + 'User/Users' , params).pipe(
      map(response =>{
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMember(username:string){
    const member = [...this.memberCache.values()].reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member:IMember) => member.userName === username);
    if(member) return of(member);
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
  setMainPhoto(photoId:number){
    return this.http.put(environment.apiUrl + `User/SetMainPhoto/${photoId}`, {});
  }

  deletePhoto(id: number) {
    return this.http.delete(environment.apiUrl + `User/DeletePhoto/${id}`, {responseType: 'text'});
  }

  private getPaginationHeaders(pageNumber:number, pageSize:number){
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }

  private getPaginatedResult<T>(url:string, params:HttpParams) {
  const paginatedResult:PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url , { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = <T>response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(<string>response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params:UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  addLike(username:string){
    return this.http.post(environment.apiUrl + `Like/${username}`, {}, {responseType: 'text'})
  }

  getLikes(predicate:string, pageNumber:number, pageSize:number){
    let params = this.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return this.getPaginatedResult<IMember[]>(environment.apiUrl + 'Like', params);
  }
}
