import { Injectable, TemplateRef } from '@angular/core';
import { unsubscribe } from 'diagnostics_channel';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { map, Observable, Observer } from 'rxjs';
import { ConfirmDialogComponent } from '../components/modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  modalRef?:BsModalRef<ConfirmDialogComponent>;

  constructor(private modalService:BsModalService) { }

  confirm(title = 'confirmation', message = 'Are you sure you want to do this', btnOkText = 'Ok',
    btnCancelText = 'Cancel') :Observable<boolean>{
    const config = {
      initialState:{
        title, message, btnOkText, btnCancelText
      }
    }
    this.modalRef = this.modalService.show(ConfirmDialogComponent, config);
    return this.modalRef.onHidden!.pipe(
      map(() => {
        return this.modalRef!.content!.result
      })
    );
  }
}
