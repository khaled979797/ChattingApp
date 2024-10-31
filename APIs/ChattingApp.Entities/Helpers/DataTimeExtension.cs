namespace ChattingApp.Entities.Helpers
{
    public static class DataTimeExtension
    {
        public static int CalculateAge(this DateTime dateOfBirth)
        {
            var today = DateTime.Now;
            var age = today.Year - dateOfBirth.Year;
            if (dateOfBirth > today.AddYears(-age)) age--;
            return age;
        }
    }
}
