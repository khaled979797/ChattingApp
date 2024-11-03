﻿using AutoMapper;
using ChattingApp.Core.Filters;
using ChattingApp.Core.Interfaces;
using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers;
using ChattingApp.Entities.Helpers.Extensions;
using ChattingApp.Entities.Helpers.Pagination.Params;
using ChattingApp.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChattingApp.Api.Controllers
{
    [Authorize]
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly IMessageRepository messageRepository;
        private readonly IMapper mapper;

        public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.messageRepository = messageRepository;
            this.mapper = mapper;
        }

        [HttpPost(Router.MessageRouting.CreateMessage)]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUsername();
            if (username == createMessageDto.RecipientUsername.ToLower()) return BadRequest("You cannot send message to yourself");

            var sender = await userRepository.GetUserByUsernameAsync(username);
            var recipient = await userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);
            if (recipient == null) return NotFound("User Not Found");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = username,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };
            messageRepository.AddMessage(message);

            if (await messageRepository.SaveAllAsync()) return Ok(mapper.Map<MessageDto>(message));
            return BadRequest("Failed to send message");
        }

        [HttpGet(Router.MessageRouting.GetMessages)]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();
            var messages = await messageRepository.GetMessagesForUser(messageParams);
            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
            return messages;
        }

        [HttpGet(Router.MessageRouting.GetMessageThread)]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread([FromRoute] string username)
        {
            var currentUsername = User.GetUsername();
            return Ok(await messageRepository.GetMessageThread(currentUsername, username));
        }

        [HttpDelete(Router.MessageRouting.DeleteMessage)]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();
            var message = await messageRepository.GetMessage(id);

            if (message.SenderUsername != username && message.RecipientUsername != username) return Unauthorized();

            if (message.SenderUsername == username) message.SenderDeleted = true;
            if (message.RecipientUsername == username) message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted) messageRepository.DeleteMessage(message);
            if (await messageRepository.SaveAllAsync()) return Ok();
            return BadRequest("Problem deleting the message");
        }
    }
}
