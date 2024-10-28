using ChattingApp.Core.Context;
using ChattingApp.Entities.Helpers;
using ChattingApp.Entities.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChattingApp.Api.Controllers
{
    [ApiController]
    public class BuggyController : ControllerBase
    {
        private readonly AppDbContext context;

        public BuggyController(AppDbContext context)
        {
            this.context = context;
        }

        [HttpGet(Router.BuggyRouting.Auth)]
        public ActionResult<string> GetSecret()
        {
            return Unauthorized("Unauthorized");
        }

        [HttpGet(Router.BuggyRouting.NotFound)]
        public ActionResult<AppUser> GetNotFound()
        {
            var user = context.Users.Find(-1);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet(Router.BuggyRouting.ServerError)]
        public ActionResult<string> GetServerError()
        {
            return context.Users.Find(-1).ToString();
        }

        [HttpGet(Router.BuggyRouting.BadRequest)]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("BadRequest");
        }
    }
}
