using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

public class UserService
{
    private readonly IMongoCollection<Users> _users;

    public UserService(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("MongoConnection"));
        var database = client.GetDatabase("SleepyApp");
        _users = database.GetCollection<Users>("Users");
    }

     public async Task<List<Users>> GetAllAsync()
    {
        return await _users.Find(u => true).ToListAsync();
    }

    public async Task<Users> GetByIdAsync(string id)
    {
        return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Users> GetByEmailAsync(string email)
    {
        return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(string id, Users userIn)
    {
        await _users.ReplaceOneAsync(u => u.Id == id, userIn);
    }

    public async Task UpdateNameAsync(string id, string newName)
    {
        var filter = Builders<Users>.Filter.Eq(u => u.Id, id);
        var update = Builders<Users>.Update.Set(u => u.Name, newName);
        await _users.UpdateOneAsync(filter, update);
    }

    public async Task UpdateEmailAsync(string id, string newEmail)
    {
        var filter = Builders<Users>.Filter.Eq(u => u.Id, id);
        var update = Builders<Users>.Update.Set(u => u.Email, newEmail);
        await _users.UpdateOneAsync(filter, update);
    }

    public async Task UpdateLastNameAsync(string id, string newLastName)
    {
        var filter = Builders<Users>.Filter.Eq(u => u.Id, id);
        var update = Builders<Users>.Update.Set(u => u.LastName, newLastName);
        await _users.UpdateOneAsync(filter, update);
    }

    public async Task UpdatePasswordAsync(string id, string newPassword)
    {
        var filter = Builders<Users>.Filter.Eq(u => u.Id, id);
        var update = Builders<Users>.Update.Set(u => u.Password, newPassword);
        await _users.UpdateOneAsync(filter, update);
    }

    public async Task UpdatePhotoAsync(string id, string photoUrl)
    {
        var update = Builders<Users>.Update.Set(u => u.Photo, photoUrl);
        await _users.UpdateOneAsync(u => u.Id == id, update);
    }

    public async Task DeleteAsync(string id)
    {
        await _users.DeleteOneAsync(u => u.Id == id);
    }

    public async Task<Users> CreateAsync(Users user)
    {
        await _users.InsertOneAsync(user);
        return user;
    }
}
