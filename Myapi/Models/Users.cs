using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class Users
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = "";

    [BsonElement("lastName")]
    public string LastName { get; set; }

    [BsonElement("email")]
    public string Email { get; set; }

    [BsonElement("age")]
    public int Age { get; set; }

    [BsonElement("weight")]
    public int Weight { get; set; }

    [BsonElement("height")]
    public int Height { get; set; }

    [BsonElement("password")]
    public string Password { get; set; }
    [BsonElement("photo")]
    public string? Photo { get; set; } = "avatar.jpg";

    [BsonElement("additionalInformation")]
    public AdditionalInformation? AdditionalInformation { get; set; }

}