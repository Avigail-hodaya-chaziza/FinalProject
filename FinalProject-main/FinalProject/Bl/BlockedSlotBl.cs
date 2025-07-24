//using Dal.Models;
//using Dal.Services;
//using System;
//using System.Collections.Generic;
//using System.Net.Http;
//using System.Text.Json;
//using System.Threading.Tasks;

//namespace Bl
//{
//    public class BlockedSlotBl
//    {
//        private readonly BlockedSlotService _blockedSlotService;
//        private readonly HttpClient _httpClient;

//        // הזרקת BlockedSlotService ו-HttpClient
//        public BlockedSlotBl(BlockedSlotService blockedSlotService, HttpClient httpClient)
//        {
//            _blockedSlotService = blockedSlotService;
//            _httpClient = httpClient;
//        }

//        public async Task<List<DateOnly>> GetBlockedDatesFromApi()
//        {
//            int currentYear = DateTime.Now.Year;
//            string apiUrl = $"https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&shabbat=on&year={currentYear}&geo=geoname&geonameid=281184";

//            HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
//            if (!response.IsSuccessStatusCode)
//            {
//                Console.WriteLine($"Failed to fetch blocked dates from API. Status Code: {response.StatusCode}");
//                return new List<DateOnly>();
//            }

//            string content = await response.Content.ReadAsStringAsync();
//            var apiResponse = JsonSerializer.Deserialize<HebcalApiResponse>(content);

//            foreach (var holiday in apiResponse.Items)
//            {
//                if (holiday.Category == "holiday" || holiday.Category == "shabbat")
//                {
//                    DateOnly dateOnly = DateOnly.FromDateTime(holiday.Date);
//                    if (!_blockedSlotService.IsDateBlocked(dateOnly))
//                    {
//                        _blockedSlotService.AddBlockedSlot(new BlockedSlot
//                        {
//                            Date = dateOnly,
//                            HolidayName = holiday.Title,

//                            Year = year,
//                            IsHoliday = true
//                        });
//                    }
//                }
//            }

//            DateTime start = new DateTime(year, 1, 1);
//            DateTime end = new DateTime(year, 12, 31);

//            for (DateTime date = start; date <= end; date = date.AddDays(1))
//            {
//                if (date.DayOfWeek == DayOfWeek.Friday)
//                {
//                    DateOnly dateOnly = DateOnly.FromDateTime(date);
//                    if (!_blockedSlotService.IsDateBlocked(dateOnly))
//                    {
//                        _blockedSlotService.AddBlockedSlot(new BlockedSlot
//                        {
//                            Date = dateOnly,
//                            HolidayName = "Friday",
//                            Year = year,
//                            IsHoliday = false
//                        });
//                    }
//                }
//            }

//            _blockedSlotService.SaveChanges();
//            return _blockedSlotService.GetAllBlockedDates();
//        }

//        public bool IsDateAvailable(DateOnly date)
//        {
//            return !_blockedSlotService.IsDateBlocked(date);
//        }

//        public class HebcalApiResponse
//        {
//            public List<HolidayApiResponse> Items { get; set; }
//        }

//        public class HolidayApiResponse
//        {
//            public string Title { get; set; }
//            public DateTime Date { get; set; }
//            public string Category { get; set; }
//        }
//    }
//}


using Dal.Models;
using Dal.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Bl
{
    public class BlockedSlotBl
    {
        private readonly BlockedSlotService _blockedSlotService;
        private readonly HttpClient _httpClient;

        // הזרקת BlockedSlotService ו-HttpClient
        public BlockedSlotBl(BlockedSlotService blockedSlotService, HttpClient httpClient)
        {
            _blockedSlotService = blockedSlotService;
            _httpClient = httpClient;
        }

        public async Task<List<DateOnly>> GetBlockedDatesFromApi()
        {
            int currentYear = DateTime.Now.Year;
            string apiUrl = $"https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&shabbat=on&year={currentYear}&geo=geoname&geonameid=281184";
            HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Failed to fetch blocked dates from API. Status Code: {response.StatusCode}");
                return new List<DateOnly>();
            }

            string content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<HebcalApiResponse>(content);


            var holidaysAndShabbat = apiResponse.Items.ToList();
            //.Where(item => item.Category == "holiday" ||
            //item.Category == "").ToList();

            if (apiResponse?.Items == null)

                return new List<DateOnly>();
            var i = 0;
            //if (i!=0)
            foreach (var item in holidaysAndShabbat)


            {
                DateOnly dateOnly = DateOnly.FromDateTime(item.Date);
                if (!_blockedSlotService.IsDateBlocked(dateOnly))
                {
                    if (!string.IsNullOrWhiteSpace(item.Title) && !string.IsNullOrWhiteSpace("IL"))
                        _blockedSlotService.AddBlockedSlot(new BlockedSlot
                    {
                        Date = dateOnly,
                        HolidayName = item.Title,
                        Year = dateOnly.Year != 1 ? dateOnly.Year : item.Date.Year,
                        IsHoliday = true
                    });
                }
            }

            //DateTime start = new DateTime(currentYear, 1, 1);
            //DateTime end = new DateTime(currentYear, 12, 31);

            //    if (i != 0)
            //        for (DateTime date = start; date <= end; date = date.AddDays(1))
            //    {
            //        if (date.DayOfWeek == DayOfWeek.Friday)
            //        {
            //            DateOnly dateOnly = DateOnly.FromDateTime(date);
            //            if (!_blockedSlotService.IsDateBlocked(dateOnly))
            //            {
            //                _blockedSlotService.AddBlockedSlot(new BlockedSlot
            //                {
            //                    Date = dateOnly,
            //                    HolidayName = "Friday",
            //                    Year = DateTime.Now.Year,
            //                    IsHoliday = false
            //                });
            //            }
            //        }
            //    }

            _blockedSlotService.SaveChanges();
            return _blockedSlotService.GetAllBlockedDates();
        }
        public async Task AddBlockedDate(DateOnly date, string holidayName)
        {
            if (_blockedSlotService.IsDateBlocked(date))
            {
                throw new InvalidOperationException("This date is already blocked.");
            }

            _blockedSlotService.AddBlockedSlot(new BlockedSlot
            {
                Date = date,
                HolidayName = holidayName,
                Year = date.Year,
                IsHoliday = true
            });
            _blockedSlotService.SaveChanges();
        }
        public bool IsDateAvailable(DateOnly date)
        {
            return !_blockedSlotService.IsDateBlocked(date);
        }

        public class HebcalApiResponse
        {
            [JsonPropertyName("items")]
            public List<HolidayApiResponse> Items { get; set; }
        }

        public class HolidayApiResponse
        {
            public string Title { get; set; }
            public DateTime Date { get; set; }
            public string Category { get; set; }
        }
    }

}