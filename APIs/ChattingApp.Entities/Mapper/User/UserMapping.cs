using AutoMapper;
using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers;
using ChattingApp.Entities.Models;

namespace ChattingApp.Entities.Mapper.User
{
    public class UserMapping : Profile
    {
        public UserMapping()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dst => dst.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dst => dst.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap<Photo, PhotoDto>();
        }
    }
}
