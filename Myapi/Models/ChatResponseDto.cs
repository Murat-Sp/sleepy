using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class ChatResponse
{
    [BsonElement("replay")]
    public string Reply { get; set; }
}