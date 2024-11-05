using AutoMapper;
using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers.Extensions;
using ChattingApp.Entities.Models;

namespace ChattingApp.Entities.Mapper
{
    public class UserMapping : Profile
    {
        public UserMapping()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dst => dst.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dst => dst.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();

            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        }
    }
}
