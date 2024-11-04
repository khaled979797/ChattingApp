import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../models/iuser';
import { AdminService } from '../../../services/admin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit{
  users!:IUser[];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  availableRoles = ['Admin', 'Moderator', 'Member'];

  constructor(private adminService:AdminService, private modalService:BsModalService){}

  ngOnInit(): void {
    this.adminService.getUsersWithRoles().subscribe(users => this.users = users);
  }

  openRolesModal(user: IUser) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...<string[]>user.roles]
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe(() =>{
      const selectedRoles = this.bsModalRef.content?.selectedRoles;
      if (!this.arrayEqual(selectedRoles!, <string[]>user.roles)) {
        this.adminService.updateUserRoles(user.username, selectedRoles!).subscribe({
          next: roles => user.roles = <string[]>roles
        })
      }
    })
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
}
