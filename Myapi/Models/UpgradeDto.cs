using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace Myapi.Models;
public class UpgradeDto
{
    public string? NewName { get; set; }
    public string? NewLastName { get; set; }
    public string? NewEmail { get; set; }
    public string? RepeatPassword { get; set; }
    public string? NewPassword { get; set;}
}
