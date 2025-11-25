# Tab-Based Applications API Documentation

## Overview
This API provides dedicated endpoints for each application status tab. Each endpoint returns **ALL records** for that specific status (no pagination applied).

---

## API Endpoints

### 1. First Interview Applications
**Endpoint:** `GET /api/applications/first-interview`

**Description:** Returns all applications with "Applicant Status" = "First Interview"

**Response:**
```json
{
  "success": true,
  "data": [
    // Array of all First Interview application records
  ],
  "count": 86,
  "status": "First Interview"
}
```

---

### 2. Final Interview Applications
**Endpoint:** `GET /api/applications/final-interview`

**Description:** Returns all applications with "Applicant Status" = "Final Interview"

**Response:**
```json
{
  "success": true,
  "data": [
    // Array of all Final Interview application records
  ],
  "count": 6,
  "status": "Final Interview"
}
```

---

### 3. Rejected Applications
**Endpoint:** `GET /api/applications/rejected`

**Description:** Returns all applications with "Applicant Status" = "Rejected"

**Response:**
```json
{
  "success": true,
  "data": [
    // Array of all Rejected application records
  ],
  "count": 31,
  "status": "Rejected"
}
```

---

### 4. Selected Applications
**Endpoint:** `GET /api/applications/selected`

**Description:** Returns all applications with "Applicant Status" = "Selected"

**Response:**
```json
{
  "success": true,
  "data": [
    // Array of all Selected application records
  ],
  "count": 2,
  "status": "Selected"
}
```

---

### 5. Hired Applications
**Endpoint:** `GET /api/applications/hired`

**Description:** Returns all applications with "Applicant Status" = "Hired"

**Response:**
```json
{
  "success": true,
  "data": [
    // Array of all Hired application records
  ],
  "count": 8,
  "status": "Hired"
}
```

---

## How It Works

### Backend Process:
1. API receives request for specific status
2. Queries Notion database with status filter
3. Fetches records in batches of 100 (Notion API limit)
4. Continues fetching until all matching records are retrieved
5. Returns complete dataset

### Example Flow:
```
User clicks "First Interview" tab
  ↓
Frontend calls: GET /api/applications/first-interview
  ↓
Backend filters Notion DB for "Applicant Status" contains "First Interview"
  ↓
Backend fetches all matching records (86 total)
  ↓
Returns: { success: true, data: [86 records], count: 86 }
  ↓
Frontend displays all 86 records
```

---

## Usage Examples

### JavaScript/Fetch
```javascript
// Get First Interview applications
const response = await fetch('/api/applications/first-interview');
const data = await response.json();
console.log(`Found ${data.count} First Interview applications`);
```

### React Example
```javascript
const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(false);

const loadFirstInterviewApps = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/applications/first-interview');
    const data = await response.json();
    if (data.success) {
      setApplications(data.data);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## Performance Considerations

### Pros:
- ✅ Simple implementation - one call per tab
- ✅ No pagination complexity on frontend
- ✅ All data available immediately for sorting/filtering
- ✅ Works well for smaller datasets (< 100 records per status)

### Cons:
- ⚠️ May be slow for statuses with many records (e.g., 2509 total applications)
- ⚠️ Loads all data even if user only views first few records
- ⚠️ Higher bandwidth usage

### Recommended For:
- Tabs with < 100 records (First Interview: 86, Final Interview: 6, etc.)
- When you need all data for client-side operations
- When simplicity is more important than optimization

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Failed to fetch [Status] applications",
  "error": "Error details here"
}
```

HTTP Status Codes:
- `200` - Success
- `405` - Method not allowed (only GET is supported)
- `500` - Server error

