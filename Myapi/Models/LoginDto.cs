using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class LoginDto
{
    public string email { get; set; }
    public string password { get; set; }
}
