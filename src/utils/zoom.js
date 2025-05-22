const axios = require('axios');
const qs = require('qs');
require('dotenv').config(); // optional if using .env for secrets

async function getZoomAccessToken() {
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const accountId = process.env.ZOOM_ACCOUNT_ID;

  const tokenResponse = await axios.post(
    'https://zoom.us/oauth/token',
    qs.stringify({
      grant_type: 'account_credentials',
      account_id: accountId
    }),
    {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return tokenResponse.data.access_token;
}

function convertToISO(dateString, timeString) {
  // Expects: dateString = "09/05/2025", timeString = "03:00 pm"
  const [day, month, year] = dateString.split('/');
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');

  if (modifier.toLowerCase() === 'pm' && parseInt(hours) < 12) {
    hours = (parseInt(hours) + 12).toString();
  } else if (modifier.toLowerCase() === 'am' && hours === '12') {
    hours = '00';
  }

  // Colombo time offset +05:30
  const isoDate = new Date(`${year}-${month}-${day}T${hours.padStart(2, '0')}:${minutes}:00+05:30`);
  return isoDate.toISOString();
}

async function createMeeting({ topic, date, time }) {
  const accessToken = await getZoomAccessToken();
  const startTime = convertToISO(date, time);

  const meetingResponse = await axios.post(
    'https://api.zoom.us/v2/users/me/meetings',
    {
      topic,
      type: 2, // Scheduled meeting
      start_time: startTime,
      duration: 30,
      timezone: 'Asia/Colombo',
      settings: {
        host_video: true,
        participant_video: true
      }
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return meetingResponse.data;
}

module.exports = {
  createMeeting
};
