import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { IUser } from '../models/iuser';
import { take } from 'rxjs';
import { AccountService } from '../services/account.service';

@Directive({
  selector: '[appIsUser]',
  standalone: true
})
export class IsUserDirective implements OnInit{
  appIsUser:IUser | null = null;

  constructor(private viewContainerRef:ViewContainerRef, private templateRef:TemplateRef<any>,
    private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.appIsUser = user);
  }

  ngOnInit(): void {
    if(this.appIsUser)this.viewContainerRef.clear;
    else this.viewContainerRef.createEmbeddedView(this.templateRef);
  }
}
