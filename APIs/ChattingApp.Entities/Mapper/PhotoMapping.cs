using AutoMapper;
using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Models;

namespace ChattingApp.Entities.Mapper
{
    public class PhotoMapping : Profile
    {
        public PhotoMapping()
        {
            CreateMap<Photo, PhotoDto>();
        }
    }
}
