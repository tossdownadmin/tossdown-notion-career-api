# Get Single Application API Documentation

## Overview
This API endpoint retrieves a single application record from Notion by its ID.

---

## API Endpoint

**URL:** `GET /api/applications/get-single`

**Method:** `GET`

**Query Parameters:**
- `id` (required) - The Notion page ID of the application

---

## Request Examples

### Example 1: Basic Request
```bash
GET /api/applications/get-single?id=1d921223-e79e-8164-8cd4-fa013f4dd093
```

### Example 2: Using Fetch (JavaScript)
```javascript
const applicationId = "1d921223-e79e-8164-8cd4-fa013f4dd093";

const response = await fetch(`/api/applications/get-single?id=${applicationId}`);
const data = await response.json();

if (data.success) {
  console.log('Application:', data.data);
}
```

### Example 3: Using Axios
```javascript
const applicationId = "1d921223-e79e-8164-8cd4-fa013f4dd093";

const { data } = await axios.get('/api/applications/get-single', {
  params: { id: applicationId }
});

console.log('Application:', data.data);
```

### Example 4: Using cURL
```bash
curl "https://your-domain.vercel.app/api/applications/get-single?id=1d921223-e79e-8164-8cd4-fa013f4dd093"
```

---

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "1d921223-e79e-8164-8cd4-fa013f4dd093",
    "created_time": "2024-01-15T10:30:00.000Z",
    "last_edited_time": "2024-01-20T14:45:00.000Z",
    "properties": {
      "Full Name": {
        "id": "title",
        "type": "title",
        "title": [
          {
            "type": "text",
            "text": {
              "content": "John Doe"
            },
            "plain_text": "John Doe"
          }
        ]
      },
      "Email Address": {
        "id": "email",
        "type": "email",
        "email": "john.doe@example.com"
      },
      "Phone Number": {
        "id": "phone",
        "type": "phone_number",
        "phone_number": "+1234567890"
      },
      "Position": {
        "id": "position",
        "type": "rich_text",
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "Frontend Developer"
            },
            "plain_text": "Frontend Developer"
          }
        ]
      },
      "Years of Experience": {
        "id": "exp",
        "type": "rich_text",
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "5"
            },
            "plain_text": "5"
          }
        ]
      },
      "Current Salary": {
        "id": "current",
        "type": "rich_text",
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "50000"
            },
            "plain_text": "50000"
          }
        ]
      },
      "Expected Salary": {
        "id": "expected",
        "type": "rich_text",
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "70000"
            },
            "plain_text": "70000"
          }
        ]
      },
      "Notice Period": {
        "id": "notice",
        "type": "rich_text",
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "30 days"
            },
            "plain_text": "30 days"
          }
        ]
      },
      "Resume File": {
        "id": "resume",
        "type": "url",
        "url": "https://example.com/resume.pdf"
      },
      "LinkedIn Profile": {
        "id": "linkedin",
        "type": "url",
        "url": "https://linkedin.com/in/johndoe"
      },
      "Applicant Status": {
        "id": "status",
        "type": "rich_text",
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "First Interview"
            },
            "plain_text": "First Interview"
          }
        ]
      }
    }
  }
}
```

---

## Error Responses

### Missing ID (400)
```json
{
  "success": false,
  "message": "Application ID is required. Use ?id={application_id}"
}
```

### Application Not Found (404)
```json
{
  "success": false,
  "message": "Application not found",
  "error": "The requested application does not exist"
}
```

### Invalid ID Format (400)
```json
{
  "success": false,
  "message": "Invalid application ID format",
  "error": "Validation error details..."
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized access to Notion API",
  "error": "Check your NOTION_TOKEN"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to fetch application",
  "error": "Error details..."
}
```

---

## Usage in React

### Example: Application Details Page

```javascript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/applications/get-single?id=${id}`);
        const data = await response.json();

        if (data.success) {
          setApplication(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch application');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);

  if (loading) return <div>Loading application...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!application) return <div>Application not found</div>;

  // Extract data from Notion properties
  const name = application.properties['Full Name']?.title?.[0]?.plain_text || 'N/A';
  const email = application.properties['Email Address']?.email || 'N/A';
  const phone = application.properties['Phone Number']?.phone_number || 'N/A';
  const position = application.properties.Position?.rich_text?.[0]?.plain_text || 'N/A';
  const experience = application.properties['Years of Experience']?.rich_text?.[0]?.plain_text || 'N/A';
  const currentSalary = application.properties['Current Salary']?.rich_text?.[0]?.plain_text || 'N/A';
  const expectedSalary = application.properties['Expected Salary']?.rich_text?.[0]?.plain_text || 'N/A';
  const noticePeriod = application.properties['Notice Period']?.rich_text?.[0]?.plain_text || 'N/A';
  const resume = application.properties['Resume File']?.url || null;
  const linkedin = application.properties['LinkedIn Profile']?.url || null;
  const status = application.properties['Applicant Status']?.rich_text?.[0]?.plain_text || 'N/A';

  return (
    <div className="application-details">
      <h1>{name}</h1>
      
      <div className="details-section">
        <h2>Contact Information</h2>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        {linkedin && <p><strong>LinkedIn:</strong> <a href={linkedin} target="_blank" rel="noopener noreferrer">View Profile</a></p>}
      </div>

      <div className="details-section">
        <h2>Position Details</h2>
        <p><strong>Position:</strong> {position}</p>
        <p><strong>Experience:</strong> {experience} years</p>
        <p><strong>Status:</strong> <span className={`status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span></p>
      </div>

      <div className="details-section">
        <h2>Salary Information</h2>
        <p><strong>Current Salary:</strong> ${currentSalary}</p>
        <p><strong>Expected Salary:</strong> ${expectedSalary}</p>
        <p><strong>Notice Period:</strong> {noticePeriod}</p>
      </div>

      {resume && (
        <div className="details-section">
          <h2>Documents</h2>
          <a href={resume} target="_blank" rel="noopener noreferrer" className="btn-download">
            Download Resume
          </a>
        </div>
      )}

      <div className="details-section">
        <p><strong>Applied:</strong> {new Date(application.created_time).toLocaleDateString()}</p>
        <p><strong>Last Updated:</strong> {new Date(application.last_edited_time).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default ApplicationDetails;
```

---

## Key Features

✅ **Direct Notion API Access** - Uses `notion.pages.retrieve()` for fast retrieval  
✅ **Complete Data** - Returns full application object with all properties  
✅ **Error Handling** - Comprehensive error responses for different scenarios  
✅ **CORS Enabled** - Works with frontend applications  
✅ **Same Response Format** - Consistent with previous implementation  

---

## Notes

1. **Application ID Format**: Must be a valid Notion page ID (UUID format with hyphens)
2. **Performance**: Direct page retrieval is faster than querying the database
3. **Permissions**: Requires valid `NOTION_TOKEN` with access to the application database
4. **Response Structure**: Returns the complete Notion page object including all properties

---

## Testing

### Test with cURL:
```bash
curl "http://localhost:3000/api/applications/get-single?id=YOUR_APPLICATION_ID"
```

### Test with Postman:
1. Method: GET
2. URL: `http://localhost:3000/api/applications/get-single`
3. Params: `id` = `YOUR_APPLICATION_ID`
4. Send request

### Test on Vercel:
```bash
curl "https://your-domain.vercel.app/api/applications/get-single?id=YOUR_APPLICATION_ID"
```

