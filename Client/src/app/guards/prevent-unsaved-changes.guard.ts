import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../components/members/member-edit/member-edit.component';
import { inject } from '@angular/core';
import { ConfirmService } from '../services/confirm.service';
import { Observable } from 'rxjs';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component:MemberEditComponent) : Observable<boolean> | boolean => {
  const confirmService = inject(ConfirmService);
  if(component.editForm.dirty){
    return confirmService.confirm();
  }
  return true;
};
