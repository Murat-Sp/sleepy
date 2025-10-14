using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class AdditionalInformation

{   [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
     [BsonElement("timeSleeping")]
    public int timeSleeping { get; set; }
    [BsonElement("WakeUptime")]
    public int WakeUptime { get; set; }
    [BsonElement("NumbersOfAwakings")]
    public int NumbersOfAwakings { get; set; }
    [BsonElement("difficultFallASleep")]
    public bool difficultFallASleep { get; set; }
    [BsonElement("moodInMorning")]
    public string moodInMorning { get; set; }
     [BsonElement("usingGadgts")]
    public bool usingGadgts { get; set; }
     [BsonElement("coffeineOrEnergyDrinks")]
    public bool coffeineOrEnergyDrinks { get; set; }
    [BsonElement("streesLevel")]
    public int streesLevel { get; set; }
        [BsonElement("physicalActivity")]
    public string physicalActivity { get; set; }
            [BsonElement("timeOfLastEating")]

    public int timeOfLastEating { get; set; }
        [BsonElement("AboutSleep")]

    public string AboutSleep { get; set; }
      [BsonElement("Notes")]
    public string Notes { get; set; }
        [BsonElement("UserId")]
    public int UserId { get; set; }


}