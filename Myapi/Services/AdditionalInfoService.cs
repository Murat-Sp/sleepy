using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

    public class AdditionalInfoService
    {
        private readonly IMongoCollection<AdditionalInformation> _addInfo;

        public AdditionalInfoService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("MongoConnection"));
            var database = client.GetDatabase("SleepyApp");
            _addInfo = database.GetCollection<AdditionalInformation>("AdditionalInfo");
        }

        // ✅ Створити новий запис
      public async Task<AdditionalInformation> CreateAsync(AdditionalInformation info)
      {
          await _addInfo.InsertOneAsync(info);
          return info;
      }

        // ✅ Отримати всі записи
        public async Task<List<AdditionalInformation>> GetAllAsync()
        {
            return await _addInfo.Find(_ => true).ToListAsync();
        }

        // ✅ Отримати запис за Id
        public async Task<AdditionalInformation?> GetByIdAsync(string id)
        {
            return await _addInfo.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        // ✅ Оновити запис
        public async Task UpdateAsync(string id, AdditionalInformation info)
        {
            await _addInfo.ReplaceOneAsync(x => x.Id == id, info);
        }

        // ✅ Видалити запис
        public async Task DeleteAsync(string id)
        {
            await _addInfo.DeleteOneAsync(x => x.Id == id);
        }
    }
