const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN || 'ntn_q88942775343WsZKAfos9DYmAhODSKSPmPmc19L6Xhc7L1'
});

const applicationDatabaseId = process.env.APPLICATION_DATABASE_ID || '1d921223-e79e-8164-8cd4-fa013f4dd093';

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    console.log('=== GET Selected Applications ===');
    
    let allResults = [];
    let hasMore = true;
    let startCursor = null;

    // Keep fetching until we have all records
    while (hasMore) {
      const queryParams = {
        database_id: applicationDatabaseId,
        page_size: 100 // Max allowed by Notion API
      };

      // Add cursor for pagination
      if (startCursor) {
        queryParams.start_cursor = startCursor;
      }

      // Add status filter
      queryParams.filter = {
        property: 'Applicant Status',
        rich_text: {
          contains: 'Selected'
        }
      };

      const response = await notion.databases.query(queryParams);

      if (response && response.results) {
        allResults = allResults.concat(response.results);
        hasMore = response.has_more;
        startCursor = response.next_cursor;
        
        console.log(`Fetched ${response.results.length} records. Total so far: ${allResults.length}. Has more: ${hasMore}`);
      } else {
        hasMore = false;
      }
    }

    console.log(`Total "Selected" records: ${allResults.length}`);

    return res.status(200).json({
      success: true,
      data: allResults,
      count: allResults.length,
      status: 'Selected'
    });

  } catch (error) {
    console.error('Error fetching Selected applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Selected applications',
      error: error.message
    });
  }
};

