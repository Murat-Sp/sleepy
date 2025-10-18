using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

public class AdditionalInformation
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("bedtime")]
    [JsonPropertyName("BedTime")]
    public string? BedTime { get; set; }

    [BsonElement("wakeTime")]
    [JsonPropertyName("Waketime")]
    public string? Waketime { get; set; }

    [BsonElement("duration")]
    [JsonPropertyName("Duration")]
    public double Duration { get; set; }

    [BsonElement("wakeUps")]
    [JsonPropertyName("WakeUps")]
    public int WakeUps { get; set; }

    [BsonElement("difficultyFallingAsleep")]
    [JsonPropertyName("DifficultyFallingAsleep")]
    public bool DifficultyFallingAsleep { get; set; }

    [BsonElement("difficultyLevel")]
    [JsonPropertyName("DifficultyLevel")]
    public int DifficultyLevel { get; set; }

    [BsonElement("mood")]
    [JsonPropertyName("Mood")]
    public string? Mood { get; set; }

    [BsonElement("usedGadgets")]
    [JsonPropertyName("UsedGadgts")] 
    public bool UsedGadgts { get; set; }

    [BsonElement("gadgetMinutes")]
    [JsonPropertyName("GadgetMinutes")]
    public int GadgetMinutes { get; set; }

    [BsonElement("caffeine")]
    [JsonPropertyName("Caffeine")]
    public bool Caffeine { get; set; }

    [BsonElement("caffeineWhen")]
    [JsonPropertyName("caffeineWhen")]
    public string? caffeineWhen { get; set; }

    [BsonElement("stress")]
    [JsonPropertyName("Stress")]
    public int Stress { get; set; }

    [BsonElement("activity")]
    [JsonPropertyName("Activity")]
    public string? Activity { get; set; }

    [BsonElement("lastMeal")]
    [JsonPropertyName("LastMeal")]
    public int LastMeal { get; set; }

    [BsonElement("dreams")]
    [JsonPropertyName("Dreams")]
    public string? Dreams { get; set; }

    [BsonElement("notes")]
    [JsonPropertyName("Notes")]
    public string? Notes { get; set; }

    [BsonElement("userId")]
    [JsonPropertyName("UserId")]
    public string? UserId { get; set; }

    [BsonElement("QualityPercent")]
    [JsonPropertyName("qualityPercent")]
    public double? QualityPercent { get; set; }

    [BsonElement("QualityScale")]
    [JsonPropertyName("qualityScale")]
    public double? QualityScale { get; set; }
}
