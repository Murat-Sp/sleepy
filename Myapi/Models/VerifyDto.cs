using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class verifyDto
{
    [BsonElement("restoreCode")]
    public string RestoreCode { get; set; }
    [BsonElement("restoreEmail")]
     public string RestoreEmail { get; set; }
}
