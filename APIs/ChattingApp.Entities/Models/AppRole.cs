﻿using Microsoft.AspNetCore.Identity;

namespace ChattingApp.Entities.Models
{
    public class AppRole : IdentityRole<int>
    {
        public ICollection<AppUserRole>? UserRoles { get; set; }
    }
}
