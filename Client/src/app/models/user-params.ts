import { IUser } from "./iuser";

export class UserParams{
  gender:string = 'male';
  minAge: number = 18;
  maxAge: number = 99;
  pageNumber: number = 1;
  pageSize: number = 5;
  orderBy: string = 'lastActive';

  constructor(user:IUser){
    this.gender = user.gender === 'female' ? 'male' : 'female';
  }
}
