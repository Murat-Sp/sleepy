using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class ChatDto
{
    [BsonElement("message")]
    public string Message{ get; set; }
}
