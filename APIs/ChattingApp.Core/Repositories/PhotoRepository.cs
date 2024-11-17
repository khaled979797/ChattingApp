using ChattingApp.Core.Interfaces;
using ChattingApp.Entities.Helpers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace ChattingApp.Core.Repositories
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly Cloudinary cloudinary;
        public PhotoRepository(CloudinarySettings cloudinarySettings)
        {
            var account = new Account
            {
                Cloud = cloudinarySettings.CloudName,
                ApiKey = cloudinarySettings.ApiKey,
                ApiSecret = cloudinarySettings.ApiSecret
            };
            cloudinary = new Cloudinary(account);
        }
        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uplaodResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                };
                uplaodResult = await cloudinary.UploadAsync(uploadParams);
            }
            return uplaodResult;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            return await cloudinary.DestroyAsync(deleteParams);
        }
    }
}
