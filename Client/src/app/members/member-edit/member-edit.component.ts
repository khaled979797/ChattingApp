import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IMember } from '../../models/imember';
import { IUser } from '../../models/iuser';
import { AccountService } from '../../services/account.service';
import { MembersService } from '../../services/members.service';
import { take } from 'rxjs/operators';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ImagesGalleryComponent } from "../images-gallery/images-gallery.component";
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, ImagesGalleryComponent, PhotoEditorComponent, TimeagoModule, CommonModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit{
  member!:IMember;
  user!:IUser;
  @ViewChild('editForm') editForm!: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event:any){
    if(this.editForm.dirty) $event.returnValue = true;
  }

  constructor(private accountService: AccountService, private membersService:MembersService, private toastr:ToastrService){
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = <IUser>user);
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.membersService.getMember(this.user.username).subscribe(member => this.member = member);
  }

  updateMember(){
    this.membersService.updateMember(this.member).subscribe(() => {
      this.toastr.success('Member updated successfully');
      this.editForm.reset(this.member);
    });
  }
}
