using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace ChattingApp.Core.Interfaces
{
    public interface IPhotoRepository
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}
