using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

[BsonIgnoreExtraElements]
public class Restore
{  
    
    public string RestoreEmail { get; set; }
    public static int code { get; set; }
}
