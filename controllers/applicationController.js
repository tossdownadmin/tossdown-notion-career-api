const { Client } = require('@notionhq/client');
const axios = require('axios');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN || 'ntn_q88942775343WsZKAfos9DYmAhODSKSPmPmc19L6Xhc7L1'
});
const applicationDatabaseId =
  process.env.APPLICATION_DATABASE_ID || "1d921223-e79e-8164-8cd4-fa013f4dd093";


// Function to get paginated application records from Notion
async function getApplicationsRecordsFromNotion(pageSize = 20, startCursor = null, statusFilter = null) {
  try {
    const queryParams = {
      database_id: applicationDatabaseId,
      page_size: pageSize
    };

    // Add start_cursor for pagination (if provided)
    if (startCursor) {
      queryParams.start_cursor = startCursor;
    }

    // Add status filter if provided
    if (statusFilter) {
      queryParams.filter = {
        property: 'Applicant Status',
        rich_text: {
          contains: statusFilter
        }
      };
    }

    console.log('Query params:', JSON.stringify(queryParams, null, 2));

    const response = await notion.databases.query(queryParams);

    if (response && response.results) {
      console.log(`Fetched ${response.results.length} records. Has more: ${response.has_more}`);

      return {
        results: response.results,
        has_more: response.has_more,
        next_cursor: response.next_cursor,
        total_fetched: response.results.length
      };
    } else {
      return { error: 'Failed to retrieve application records' };
    }

  } catch (error) {
    console.error('Error fetching from Notion:', error);

    // Fallback to using axios if the Notion client fails
    try {
      const url = `https://api.notion.com/v1/databases/${applicationDatabaseId}/query`;
      const headers = {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN || 'ntn_q88942775343WsZKAfos9DYmAhODSKSPmPmc19L6Xhc7L1'}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      };

      const requestBody = {
        page_size: pageSize
      };

      if (startCursor) {
        requestBody.start_cursor = startCursor;
      }

      // Add status filter if provided
      if (statusFilter) {
        requestBody.filter = {
          property: 'Applicant Status',
          rich_text: {
            contains: statusFilter
          }
        };
      }

      const response = await axios.post(url, requestBody, { headers });

      if (response.data && response.data.results) {
        console.log(`Axios fallback: Fetched ${response.data.results.length} records. Has more: ${response.data.has_more}`);

        return {
          results: response.data.results,
          has_more: response.data.has_more,
          next_cursor: response.data.next_cursor,
          total_fetched: response.data.results.length
        };
      }
    } catch (axiosError) {
      console.error('Axios fallback error:', axiosError);
    }

    return { error: 'Failed to retrieve application records' };
  }
}

// Function to get single application by ID
async function getSingleApplicationById(applicationId) {
  try {
    const response = await notion.pages.retrieve({ page_id: applicationId });
    return response;
  } catch (error) {
    console.error('Error fetching single application:', error);
    return null;
  }
}

// Get applications (paginated or by ID)
exports.getApplications = async (req, res) => {
  try {
    // Get query parameters
    const requestedId = req.query.id || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const cursor = req.query.cursor || null;
    const status = req.query.status || null;

    console.log('=== Get Applications API Debug ===');
    console.log('Requested ID:', requestedId);
    console.log('Page:', page);
    console.log('Limit:', limit);
    console.log('Cursor:', cursor);
    console.log('Status Filter:', status);

    // Validate limit (max 100 as per Notion API)
    if (limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit cannot exceed 100 records per page'
      });
    }

    // If an ID is present, get single record
    if (requestedId) {
      const record = await getSingleApplicationById(requestedId);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Record not found'
        });
      }

      return res.json({
        success: true,
        data: record
      });
    }

    // Get paginated records with optional status filter
    const pageData = await getApplicationsRecordsFromNotion(limit, cursor, status);

    if (pageData.error) {
      return res.status(500).json({ success: false, message: pageData.error });
    }

    // Prepare pagination response
    const response = {
      success: true,
      data: pageData.results,
      pagination: {
        current_page: page,
        page_size: limit,
        has_more: pageData.has_more,
        next_cursor: pageData.next_cursor,
        total_in_page: pageData.total_fetched
      }
    };

    console.log(`Returning ${pageData.total_fetched} records for page ${page}`);
    res.json(response);

  } catch (error) {
    console.error('Error in getApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications',
      error: error.message
    });
  }
};



const { submitInterviewData } = require('../utils/interviewService');

// Submit interview results (HR, Technical, or Final)
exports.submitInterview = async (req, res) => {
  try {
    // Debug logging
    console.log('=== Controller Debug ===');
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', req.body ? Object.keys(req.body) : 'No body');

    const { applicationId, interviewType, interviewData } = req.body;

    console.log('Extracted values:');
    console.log('- applicationId:', applicationId, '(type:', typeof applicationId, ')');
    console.log('- interviewType:', interviewType, '(type:', typeof interviewType, ')');
    console.log('- interviewData:', !!interviewData, '(type:', typeof interviewData, ')');

    const result = await submitInterviewData(applicationId, interviewType, interviewData);
    res.json(result);

  } catch (error) {
    console.error('Error in submitInterview:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting interview',
      error: error.message
    });
  }
};

// Update interview questions only
exports.updateQuestions = async (req, res) => {
  try {
    // Import the serverless function and call it
    const updateQuestionsHandler = require('../api/applications/update-questions.js');
    await updateQuestionsHandler(req, res);
  } catch (error) {
    console.error('Error in updateQuestions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating questions',
      error: error.message
    });
  }
};

// Update application status
exports.updateStatus = async (req, res) => {
  try {
    // Import the serverless function and call it
    const updateStatusHandler = require('../api/applications/update-status.js');
    await updateStatusHandler(req, res);
  } catch (error) {
    console.error('Error in updateStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating status',
      error: error.message
    });
  }
};

// Function to get ALL records for a specific status (no pagination)
async function getAllRecordsByStatus(statusFilter) {
  try {
    let allResults = [];
    let hasMore = true;
    let startCursor = null;

    console.log(`Fetching ALL records for status: ${statusFilter}`);

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
          contains: statusFilter
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

    console.log(`Total records fetched for "${statusFilter}": ${allResults.length}`);
    return allResults;

  } catch (error) {
    console.error(`Error fetching all records for status "${statusFilter}":`, error);
    throw error;
  }
}

// Get all "First Interview" applications
exports.getFirstInterviewApplications = async (req, res) => {
  try {
    console.log('=== GET First Interview Applications ===');

    const results = await getAllRecordsByStatus('First Interview');

    res.status(200).json({
      success: true,
      data: results,
      count: results.length,
      status: 'First Interview'
    });
  } catch (error) {
    console.error('Error in getFirstInterviewApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch First Interview applications',
      error: error.message
    });
  }
};

// Get all "Final Interview" applications
exports.getFinalInterviewApplications = async (req, res) => {
  try {
    console.log('=== GET Final Interview Applications ===');

    const results = await getAllRecordsByStatus('Final Interview');

    res.status(200).json({
      success: true,
      data: results,
      count: results.length,
      status: 'Final Interview'
    });
  } catch (error) {
    console.error('Error in getFinalInterviewApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Final Interview applications',
      error: error.message
    });
  }
};

// Get all "Rejected" applications
exports.getRejectedApplications = async (req, res) => {
  try {
    console.log('=== GET Rejected Applications ===');

    const results = await getAllRecordsByStatus('Rejected');

    res.status(200).json({
      success: true,
      data: results,
      count: results.length,
      status: 'Rejected'
    });
  } catch (error) {
    console.error('Error in getRejectedApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Rejected applications',
      error: error.message
    });
  }
};

// Get all "Selected" applications
exports.getSelectedApplications = async (req, res) => {
  try {
    console.log('=== GET Selected Applications ===');

    const results = await getAllRecordsByStatus('Selected');

    res.status(200).json({
      success: true,
      data: results,
      count: results.length,
      status: 'Selected'
    });
  } catch (error) {
    console.error('Error in getSelectedApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Selected applications',
      error: error.message
    });
  }
};

// Get all "Hired" applications
exports.getHiredApplications = async (req, res) => {
  try {
    console.log('=== GET Hired Applications ===');

    const results = await getAllRecordsByStatus('Hired');

    res.status(200).json({
      success: true,
      data: results,
      count: results.length,
      status: 'Hired'
    });
  } catch (error) {
    console.error('Error in getHiredApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Hired applications',
      error: error.message
    });
  }
};

