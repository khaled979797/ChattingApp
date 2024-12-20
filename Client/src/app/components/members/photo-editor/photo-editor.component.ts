import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { take } from 'rxjs/operators';import { IMember } from '../../../models/imember';
import { IUser } from '../../../models/iuser';
import { AccountService } from '../../../services/account.service';
import { MembersService } from '../../../services/members.service';
import { environment } from '../../../../environments/environment.development';
import { IPhoto } from '../../../models/iphoto';
;

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit{
  @Input() member!:IMember;
  uploader?:FileUploader;
  hasBaseDropZoneOver = false;
  user!: IUser;

  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {if (user) this.user = user})
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(event:any){
    this.hasBaseDropZoneOver = event;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: environment.apiUrl + 'User/AddPhoto',
      authToken: `Bearer ${this.user?.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
        if (photo.isMain && this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  }

  setMainPhoto(photo:IPhoto){
    this.memberService.setMainPhoto(photo.id).subscribe(() =>{
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p =>{
        if(p.isMain) p.isMain = false;
        if(p.id === photo.id) p.isMain = true;
      })
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(x => x.id !== photoId);
        }
      }
    })
  }
}
