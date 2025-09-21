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
            try
            {
                Console.WriteLine("Starting to fetch blocked dates from API...");
                
                // מחק את כל הטבלה
                Console.WriteLine("Clearing all existing blocked slots...");
                _blockedSlotService.ClearAllBlockedSlots();
                Console.WriteLine("All blocked slots cleared");
                
                int currentYear = DateTime.Now.Year;
                int nextYear = currentYear + 1;
                
                var allDates = new List<DateOnly>();
                
                // טען תאריכים לשנה הנוכחת ולשנה הבאה
                foreach (int year in new[] { currentYear, nextYear })
                {
                    string apiUrl = $"https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&shabbat=on&year={year}&geo=geoname&geonameid=281184";
                    Console.WriteLine($"API URL for year {year}: {apiUrl}");
                
                    HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
                    if (!response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"Failed to fetch blocked dates for year {year}. Status Code: {response.StatusCode}");
                        continue; // המשך לשנה הבאה
                    }
                    Console.WriteLine($"API call successful for year {year}!");

                    string content = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"API Response content length for year {year}: {content.Length}");
                    Console.WriteLine($"First 500 chars of API response: {content.Substring(0, Math.Min(500, content.Length))}");
                    
                    if (string.IsNullOrWhiteSpace(content))
                    {
                        Console.WriteLine($"API returned empty content for year {year}");
                        continue;
                    }
                    
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    var apiResponse = JsonSerializer.Deserialize<HebcalApiResponse>(content, options);
                    
                    Console.WriteLine($"Deserialized API response for year {year}. Items count: {apiResponse?.Items?.Count ?? 0}");
                    
                    if (apiResponse?.Items?.Count > 0)
                    {
                        Console.WriteLine($"First few items:");
                        for (int i = 0; i < Math.Min(5, apiResponse.Items.Count); i++)
                        {
                            var item = apiResponse.Items[i];
                            Console.WriteLine($"  {i+1}. {item.Date:yyyy-MM-dd} - {item.Title} ({item.Category})");
                        }
                    }

                    if (apiResponse?.Items == null)
                    {
                        Console.WriteLine($"API response items is null for year {year}");
                        continue;
                    }

                    var holidaysAndShabbat = apiResponse.Items.ToList();
                    Console.WriteLine($"Processing {holidaysAndShabbat.Count} items from API for year {year}");
                    
                    // הדפס כמה פריטים מכל קטגוריה
                    var categories = holidaysAndShabbat.GroupBy(x => x.Category).ToList();
                    foreach (var cat in categories)
                    {
                        Console.WriteLine($"Category '{cat.Key}': {cat.Count()} items");
                    }
                    
                    foreach (var item in holidaysAndShabbat)
                    {
                        try
                        {
                            DateOnly dateOnly = DateOnly.FromDateTime(item.Date);
                            if (!string.IsNullOrWhiteSpace(item.Title))
                            {
                                Console.WriteLine($"Adding: {dateOnly} - {item.Title}");
                                _blockedSlotService.AddBlockedSlotDirectly(dateOnly, item.Title, year);
                                allDates.Add(dateOnly);
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error adding {item.Date}: {ex.Message}");
                        }
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

                Console.WriteLine($"Total blocked dates processed: {allDates.Count}");
                var finalCount = _blockedSlotService.GetAllBlockedSlots().Count;
                Console.WriteLine($"Final count in database: {finalCount}");
                return _blockedSlotService.GetAllBlockedDates();
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"HTTP Request Exception: {ex.Message}");
                return new List<DateOnly>();
            }
            catch (TaskCanceledException ex)
            {
                Console.WriteLine($"Request timeout: {ex.Message}");
                return new List<DateOnly>();
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"JSON parsing error: {ex.Message}");
                return new List<DateOnly>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                return new List<DateOnly>();
            }
        }
        public async Task AddBlockedDate(DateOnly date, string holidayName, string? countryCode = null)
        {
            if (_blockedSlotService.IsDateBlocked(date))
            {
                throw new InvalidOperationException("התאריך כבר חסום במערכת");
            }

            _blockedSlotService.AddBlockedSlot(new BlockedSlot
            {
                Date = date,
                HolidayName = holidayName,
                Year = date.Year,
                IsHoliday = true,
                CountryCode = countryCode ?? "IL"  // ברירת מחדל אם לא התקבל ערך
            });
            _blockedSlotService.SaveChanges();
        }

        public bool IsDateAvailable(DateOnly date)
        {
            return !_blockedSlotService.IsDateBlocked(date);
        }

        public List<BlockedSlot> GetAllBlockedDates()
        {
            return _blockedSlotService.GetAllBlockedSlots();
        }

        public class HebcalApiResponse
        {
            [JsonPropertyName("items")]
            public List<HolidayApiResponse> Items { get; set; }
        }

        public class HolidayApiResponse
        {
            [JsonPropertyName("title")]
            public string Title { get; set; }
            
            [JsonPropertyName("date")]
            public DateTime Date { get; set; }
            
            [JsonPropertyName("category")]
            public string Category { get; set; }
        }
    }

}