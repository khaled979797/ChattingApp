import { Directive, Input, input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../services/account.service';
import { take } from 'rxjs';
import { IUser } from '../models/iuser';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit{
  user!:IUser;
  @Input() appHasRole:string[] = [];

  constructor(private viewContainerRef:ViewContainerRef, private templateRef:TemplateRef<any>, private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = <IUser>user);
  }
  ngOnInit(): void {
    if(!this.user.roles || !this.user){
      this.viewContainerRef.clear;
      return;
    }
    if(this.user.roles.some(r => this.appHasRole.includes(r))){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    else{
      this.viewContainerRef.clear;
    }
  }
}
