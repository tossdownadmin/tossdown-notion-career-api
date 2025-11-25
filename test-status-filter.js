// Test script to check status filtering with pagination API
const getApplicationsHandler = require('./api/applications/get-applications.js');

// Mock request and response objects
function createMockReq(query = {}) {
    return {
        method: 'GET',
        query: query,
        headers: {
            'content-type': 'application/json'
        }
    };
}

function createMockRes() {
    const res = {
        statusCode: 200,
        headers: {},
        body: null,

        setHeader(name, value) {
            this.headers[name] = value;
        },

        status(code) {
            this.statusCode = code;
            return this;
        },

        json(data) {
            this.body = data;
            console.log('\n📦 Response:', JSON.stringify(data, null, 2));
            return this;
        },

        end() {
            return this;
        }
    };
    return res;
}

async function testStatusFilter() {
  console.log('=== TEST 1: Get All Applications (No Filter) ===');
  const req1 = createMockReq({ limit: 5 });
  const res1 = createMockRes();
  await getApplicationsHandler(req1, res1);

  if (res1.body && res1.body.success) {
    console.log(`✅ Found ${res1.body.data.length} applications`);
    console.log(`   Has more: ${res1.body.pagination.has_more}`);

    // Check what status fields exist
    if (res1.body.data.length > 0) {
      const firstRecord = res1.body.data[0];
      console.log('\n📋 Available properties in first record:');
      Object.keys(firstRecord.properties).forEach(key => {
        if (key.toLowerCase().includes('status')) {
          console.log(`   - "${key}": ${firstRecord.properties[key].type || 'unknown'}`);
          console.log(`     Value:`, firstRecord.properties[key]);
        }
      });
    }
  } else {
    console.log('❌ Failed to get applications');
  }

  console.log('\n=== TEST 2: Filter by "First Interview" ===');
  const req2 = createMockReq({ limit: 5, status: 'First Interview' });
  const res2 = createMockRes();
  await getApplicationsHandler(req2, res2);

  if (res2.body && res2.body.success) {
    console.log(`✅ Found ${res2.body.data.length} "First Interview" applications`);
    console.log(`   Has more: ${res2.body.pagination.has_more}`);
  } else {
    console.log('❌ Failed to filter applications');
  }

  console.log('\n=== TEST 3: Filter by "Rejected" ===');
  const req3 = createMockReq({ limit: 5, status: 'Rejected' });
  const res3 = createMockRes();
  await getApplicationsHandler(req3, res3);

  if (res3.body && res3.body.success) {
    console.log(`✅ Found ${res3.body.data.length} "Rejected" applications`);
    console.log(`   Has more: ${res3.body.pagination.has_more}`);
  } else {
    console.log('❌ Failed to filter applications');
  }

  console.log('\n=== TEST 4: Filter by "Selected" ===');
  const req4 = createMockReq({ limit: 5, status: 'Selected' });
  const res4 = createMockRes();
  await getApplicationsHandler(req4, res4);

  if (res4.body && res4.body.success) {
    console.log(`✅ Found ${res4.body.data.length} "Selected" applications`);
    console.log(`   Has more: ${res4.body.pagination.has_more}`);
  } else {
    console.log('❌ Failed to filter applications');
  }
}

testStatusFilter().catch(console.error);

