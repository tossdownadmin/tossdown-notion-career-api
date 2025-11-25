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
    // Get application ID from query parameter
    const applicationId = req.query.id;

    console.log('=== GET Single Application ===');
    console.log('Application ID:', applicationId);

    // Validate application ID
    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required. Use ?id={application_id}'
      });
    }

    // Fetch single application from Notion using pages.retrieve
    const application = await notion.pages.retrieve({ 
      page_id: applicationId 
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    console.log(`Successfully retrieved application: ${applicationId}`);

    // Return the application data in the same format as before
    return res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Error fetching single application:', error);

    // Handle specific Notion API errors
    if (error.code === 'object_not_found') {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
        error: 'The requested application does not exist'
      });
    }

    if (error.code === 'validation_error') {
      return res.status(400).json({
        success: false,
        message: 'Invalid application ID format',
        error: error.message
      });
    }

    if (error.code === 'unauthorized') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access to Notion API',
        error: 'Check your NOTION_TOKEN'
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error.message
    });
  }
};

