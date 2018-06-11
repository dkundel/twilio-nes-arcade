// Webhook to handle submissions. Handles SMS & Twitter via Zapier

exports.handler = function (context, event, callback) {
  const SUBMISSION_LIST = 'arcade_submissions';
  const SERVICE_SID = context.ARCADE_SERVICE;

  let resp = {};
  let contact;
  let submission;
  if (event.From) {
    const toCensor = event.From.substr(4, event.From.length - 8);
    contact = event.From.replace(toCensor, 'x'.repeat(toCensor.length));
    resp = new Twilio.twiml.MessagingResponse();
    resp.message(
      'Thanks for submitting! Your submission will be scheduled to run at the Twilio booth.'
    );
  } else if (event.Twitter) {
    contact = event.Twitter;
  }

  submission = event.Body.replace(/#twilioArcade/i, '').trim();

  const twilioClient = context.getTwilioClient();
  twilioClient.sync
    .services(SERVICE_SID)
    .syncLists(SUBMISSION_LIST)
    .syncListItems.create({ data: { instructions: submission, name: contact } })
    .then(x => {
      callback(null, resp);
    })
    .catch(err => callback(err));
};
