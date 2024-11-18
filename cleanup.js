const cron = require('node-cron');
const urlModel = require('./db');

// Schedule a cron job to delete expired URLs every 1 hour
cron.schedule('0 * * * *', async () => {
  try {
    const expiredUrls = await urlModel.deleteMany({
      isRegisteredUser: false,
      expirationTime: { $lt: new Date() }
    });
    console.log(`Deleted ${expiredUrls.deletedCount} expired URLs`);
  } catch (err) {
    console.error('Error cleaning up expired URLs:', err);
  }
});
