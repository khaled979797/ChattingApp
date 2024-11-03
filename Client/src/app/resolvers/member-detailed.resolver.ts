import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MembersService } from '../services/members.service';
import { IMember } from '../models/imember';

export const memberDetailedResolver: ResolveFn<IMember> = (route, state) => {
  const memberService = inject(MembersService);
  return memberService.getMember(<string>route.paramMap.get('username'));
};
