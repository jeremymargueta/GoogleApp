using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace my_api.Controllers;

[ApiController]
[Route("[controller]")]
public class EmailController : ControllerBase
{
    private readonly ILogger<EmailController> _logger;

    public EmailController(ILogger<EmailController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "Send")]
    public async Task<IActionResult> SendAsync(string email, string summary, string datetime)
    {
        SmtpClient client = new SmtpClient
        {
            Port = 587,
            Host = "smtp.gmail.com", //or another email sender provider
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false
        };

        client.Credentials = new NetworkCredential("cappyxp727@gmail.com", "mmrn dlha ismr vnkh ");

        try
        {
            await client.SendMailAsync("cappyxp727@gmail.com", email, "Meeting reminder!", $"This is a notice for an upcoming meeting.\nmeeting title is {summary} and it should start at {datetime}.\nWe're always happy to hear great ideas from you!");
        }
        catch (Exception ex)
        {
            this._logger.LogCritical(ex, "Something wrong happened.");
        }

        return Ok();
    }
}
