import { Component, Input } from '@angular/core';
import { IMember } from '../../models/imember';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  @Input() member?:IMember;
}
