# v0.dev Prompt for Tab-Based Applications

## Copy this prompt to v0.dev:

```
Update the Applications page to implement tab-based filtering with dedicated API endpoints for each status.

CURRENT UI:
- Tabs for different statuses: Total Applications, First Interview, Final Interview, Rejected, Selected, Hired
- Stats cards showing: Total (2509), First Interview (86), Final Interview (6), Rejected (31), Selected (2), Hired (8)
- Search bar, date filter, position filter
- Applications table with columns: Name, Position, Exp, Summary, Feedback, Current, Expected, Notice, Resume, Applicant, Status, Applied

API ENDPOINTS:

Each tab has a dedicated endpoint that returns ALL records for that status:

1. First Interview: GET /api/applications/first-interview
2. Final Interview: GET /api/applications/final-interview
3. Rejected: GET /api/applications/rejected
4. Selected: GET /api/applications/selected
5. Hired: GET /api/applications/hired
6. Total Applications: GET /api/applications (existing endpoint with pagination)

Response Format (for status-specific endpoints):
{
  "success": true,
  "data": [/* array of all applications for this status */],
  "count": 86,
  "status": "First Interview"
}

IMPLEMENTATION:

1. State Management:
```javascript
const [activeTab, setActiveTab] = useState('all');
const [tabsData, setTabsData] = useState({
  all: { applications: [], loaded: false, loading: false },
  firstInterview: { applications: [], loaded: false, loading: false },
  finalInterview: { applications: [], loaded: false, loading: false },
  rejected: { applications: [], loaded: false, loading: false },
  selected: { applications: [], loaded: false, loading: false },
  hired: { applications: [], loaded: false, loading: false }
});
```

2. Fetch Function:
```javascript
const fetchTabData = async (tabKey, endpoint) => {
  // Set loading state
  setTabsData(prev => ({
    ...prev,
    [tabKey]: { ...prev[tabKey], loading: true }
  }));

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    
    if (data.success) {
      setTabsData(prev => ({
        ...prev,
        [tabKey]: {
          applications: data.data,
          loaded: true,
          loading: false,
          count: data.count
        }
      }));
    }
  } catch (error) {
    console.error('Error fetching tab data:', error);
    setTabsData(prev => ({
      ...prev,
      [tabKey]: { ...prev[tabKey], loading: false }
    }));
  }
};
```

3. Tab Click Handler:
```javascript
const handleTabClick = (tabKey) => {
  setActiveTab(tabKey);
  
  // Only fetch if not already loaded
  if (!tabsData[tabKey].loaded && !tabsData[tabKey].loading) {
    const endpoints = {
      all: '/api/applications?limit=100',
      firstInterview: '/api/applications/first-interview',
      finalInterview: '/api/applications/final-interview',
      rejected: '/api/applications/rejected',
      selected: '/api/applications/selected',
      hired: '/api/applications/hired'
    };
    
    fetchTabData(tabKey, endpoints[tabKey]);
  }
};
```

4. Initial Load:
```javascript
useEffect(() => {
  // Load "all" tab on mount
  if (!tabsData.all.loaded) {
    fetchTabData('all', '/api/applications?limit=100');
  }
}, []);
```

5. Render:
```jsx
<div className="applications-container">
  {/* Tabs */}
  <div className="tabs">
    <button 
      className={activeTab === 'all' ? 'active' : ''}
      onClick={() => handleTabClick('all')}
    >
      Total Applications (2509)
    </button>
    <button 
      className={activeTab === 'firstInterview' ? 'active' : ''}
      onClick={() => handleTabClick('firstInterview')}
    >
      First Interview (86)
    </button>
    <button 
      className={activeTab === 'finalInterview' ? 'active' : ''}
      onClick={() => handleTabClick('finalInterview')}
    >
      Final Interview (6)
    </button>
    <button 
      className={activeTab === 'rejected' ? 'active' : ''}
      onClick={() => handleTabClick('rejected')}
    >
      Rejected (31)
    </button>
    <button 
      className={activeTab === 'selected' ? 'active' : ''}
      onClick={() => handleTabClick('selected')}
    >
      Selected (2)
    </button>
    <button 
      className={activeTab === 'hired' ? 'active' : ''}
      onClick={() => handleTabClick('hired')}
    >
      Hired (8)
    </button>
  </div>

  {/* Content */}
  <div className="tab-content">
    {tabsData[activeTab].loading ? (
      <div className="loading">Loading applications...</div>
    ) : (
      <>
        <table className="applications-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Exp</th>
              <th>Summary</th>
              <th>Feedback</th>
              <th>Current</th>
              <th>Expected</th>
              <th>Notice</th>
              <th>Resume</th>
              <th>Applicant</th>
              <th>Status</th>
              <th>Applied</th>
            </tr>
          </thead>
          <tbody>
            {tabsData[activeTab].applications.map(app => (
              <tr key={app.id}>
                {/* Render table cells */}
              </tr>
            ))}
          </tbody>
        </table>
        
        <p className="count-text">
          Showing {tabsData[activeTab].applications.length} applications
        </p>
      </>
    )}
  </div>
</div>
```

FEATURES:
- Lazy loading: Only fetch when tab is clicked
- Caching: Don't refetch when switching back to visited tabs
- Loading states: Show spinner while fetching
- All data loaded at once per tab (no "Load More" needed)
- Search/filters apply to loaded data
- Refresh button clears all cached data

DESIGN:
- Keep exact same UI styling
- Active tab: highlighted with border/background
- Loading state: centered spinner with text
- Count text: muted gray, 14px, below table
- Smooth tab transitions
- Responsive design

Keep exact same visual design, add tab-based data fetching.
```

