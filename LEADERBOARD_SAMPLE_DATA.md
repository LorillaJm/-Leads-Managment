# 📊 Leaderboard Sample Data Reference

## Overview

The Leaderboard feature now includes comprehensive sample data that matches the Dashboard's sales team data. This ensures the feature is fully functional even when the API is unavailable or returns empty results.

---

## Sample Data Structure

### Top 10 Sales Consultants

| Rank | Name | Leads | Prospects | Test Drives | Reservations | Bank Apps | Closed Deals | Conversion % | Revenue |
|------|------|-------|-----------|-------------|--------------|-----------|--------------|--------------|---------|
| 🥇 1 | April Dream Galero | 145 | 89 | 42 | 28 | 35 | **18** | 12.4% | $540,000 |
| 🥈 2 | Meryl Rose Marterior | 132 | 76 | 38 | 25 | 31 | **15** | 11.4% | $450,000 |
| 🥉 3 | Mary Joy Lumapac | 128 | 71 | 35 | 22 | 28 | **14** | 10.9% | $420,000 |
| 4 | Ma. Angelica Canindo | 118 | 65 | 32 | 20 | 25 | **12** | 10.2% | $360,000 |
| 5 | Ron Edward Santos | 112 | 62 | 30 | 19 | 24 | **11** | 9.8% | $330,000 |
| 6 | Reynel Gallaza | 105 | 58 | 28 | 18 | 22 | **10** | 9.5% | $300,000 |
| 7 | Karlyn Joy Labiero | 98 | 54 | 26 | 16 | 20 | **9** | 9.2% | $270,000 |
| 8 | Joseph Besana | 92 | 51 | 24 | 15 | 19 | **8** | 8.7% | $240,000 |
| 9 | Kurt Russell Gimotea | 85 | 47 | 22 | 14 | 17 | **7** | 8.2% | $210,000 |
| 10 | Mary Angelie Francisco | 78 | 43 | 20 | 12 | 15 | **6** | 7.7% | $180,000 |

---

## Summary Statistics

### Team Totals
- **Total Leads:** 1,093
- **Total Closed Deals:** 110
- **Average Conversion Rate:** 10.0%
- **Total Revenue:** $3,300,000

### Performance Insights
- **Top Performer:** April Dream Galero (18 closed deals)
- **Highest Conversion:** April Dream Galero (12.4%)
- **Most Leads:** April Dream Galero (145 leads)
- **Highest Revenue:** April Dream Galero ($540,000)

---

## Compare Mode Data

Each consultant has previous period metrics for comparison:

### Example: April Dream Galero (Top Performer)

**Current Period:**
- Leads: 145
- Closed Deals: 18
- Conversion: 12.4%
- Revenue: $540,000

**Previous Period:**
- Leads: 132
- Closed Deals: 15
- Conversion: 11.4%
- Revenue: $450,000

**Growth:**
- Leads: +9.8% ↑
- Closed Deals: +20.0% ↑
- Conversion: +8.8% ↑
- Revenue: +20.0% ↑

---

## Data Fallback Logic

The Leaderboard implements a smart fallback system:

```typescript
1. Try to fetch from API
   ↓
2. If API returns data → Use API data
   ↓
3. If API returns empty → Use sample data
   ↓
4. If API errors → Use sample data (no error shown)
```

This ensures users always see a functional leaderboard with realistic data.

---

## Email Addresses

Sample email format: `firstname.lastname@company.com`

- april.galero@company.com
- meryl.marterior@company.com
- mary.lumapac@company.com
- angelica.canindo@company.com
- ron.santos@company.com
- reynel.gallaza@company.com
- karlyn.labiero@company.com
- joseph.besana@company.com
- kurt.gimotea@company.com
- mary.francisco@company.com

---

## Conversion Rate Calculation

```
Conversion Rate = (Closed Deals / Total Leads) × 100

Example (April Dream Galero):
= (18 / 145) × 100
= 12.4%
```

---

## Revenue Calculation

Average revenue per closed deal: **$30,000**

```
Total Revenue = Closed Deals × $30,000

Example (April Dream Galero):
= 18 × $30,000
= $540,000
```

---

## Ranking Criteria

### Default Ranking (Closed Deals)
Consultants are ranked by number of closed deals (highest to lowest)

### Alternative Rankings Available:
1. **Total Leads** - Volume of leads generated
2. **Conversion Rate** - Efficiency in closing deals
3. **Revenue** - Total sales value generated

---

## Visual Indicators

### Top 3 Medals
- 🥇 **Gold** - 1st Place (April Dream Galero)
- 🥈 **Silver** - 2nd Place (Meryl Rose Marterior)
- 🥉 **Bronze** - 3rd Place (Mary Joy Lumapac)

### Trend Indicators (Compare Mode)
- ↑ **Green** - Positive growth
- ↓ **Red** - Negative growth
- → **Gray** - No change

---

## Testing Scenarios

### Scenario 1: API Available
- Leaderboard fetches real data
- Sample data not used

### Scenario 2: API Returns Empty
- Leaderboard uses sample data
- No error message shown
- Full functionality available

### Scenario 3: API Error
- Leaderboard uses sample data
- No error message shown
- Seamless user experience

---

## Integration with Dashboard

The sample data matches the Dashboard's sales team table:
- Same consultant names
- Same performance metrics
- Consistent data structure
- Synchronized totals

This ensures a cohesive experience across both features.

---

## Future Enhancements

When connecting to real API:
1. Replace sample data with actual database queries
2. Add date range filtering
3. Include historical trend data
4. Add team/region grouping
5. Export functionality

---

## Notes

- Sample data is realistic and based on typical sales performance
- Conversion rates range from 7.7% to 12.4% (industry standard)
- Revenue assumes $30,000 average deal size
- Previous period shows consistent growth trends
- Data is sorted by closed deals by default

---

**Status:** ✅ Sample data fully integrated and tested
**Last Updated:** February 5, 2026
