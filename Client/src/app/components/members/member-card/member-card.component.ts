import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from '../../../services/members.service';
import { IMember } from '../../../models/imember';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  @Input() member!:IMember;

  constructor(private membersService:MembersService, private toastr:ToastrService){}

  addLike(member:IMember){
    this.membersService.addLike(member.userName).subscribe(() =>{
      this.toastr.success(`You have liked ${member.knownAs}`)
    })
  }
}
