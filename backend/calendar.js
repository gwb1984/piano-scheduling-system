const { google } = require('googleapis');
const calendar = google.calendar('v3');
const { oauth2Client } = require('./auth');

const listAvailableSlots = async (token) => {
  oauth2Client.setCredentials(token);
  const freebusy = await calendar.freebusy.query({
    auth: oauth2Client,
    requestBody: {
      timeMin: new Date().toISOString(),
      timeMax: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      items: [{ id: 'primary' }]
    }
  });
  const busyTimes = freebusy.data.calendars.primary.busy;
  // 根据繁忙时间计算空闲时间段
  return busyTimes;
};

const scheduleLesson = async (token, time) => {
  oauth2Client.setCredentials(token);
  await calendar.events.insert({
    auth: oauth2Client,
    calendarId: 'primary',
    requestBody: {
      summary: 'Piano Lesson',
      start: { dateTime: time },
      end: { dateTime: new Date(new Date(time).getTime() + 60 * 60 * 1000).toISOString() }
    }
  });
};

const cancelLesson = async (token, eventId) => {
  oauth2Client.setCredentials(token);
  await calendar.events.delete({
    auth: oauth2Client,
    calendarId: 'primary',
    eventId
  });
};

module.exports = { listAvailableSlots, scheduleLesson, cancelLesson };
