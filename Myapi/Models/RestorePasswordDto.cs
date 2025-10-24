using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class RestorePasswordDto
{
    [BsonElement("restorePassword")]
    public string RestorePassword { get; set; }
     [BsonElement("restoreEmail")]
     public string RestoreEmail { get; set; }
}
