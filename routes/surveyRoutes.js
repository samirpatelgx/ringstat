const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const dynaMongo = require("../../dynomongo/");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplates")

const Survey = dynaMongo.model("surveys");

module.exports = app => {
  app.get("/api/surveys/thanks", (req, res) => {
    res.send("Thanks for voting!");
  })

  app.post("/api/surveys/webhooks", (req, res) => {
    const p = new Path("/api/surveys/:surveyId/:choice")

    const events = _.chain(req.body)
    .map( ({ email, url }) => {

      const match = p.test(new URL(url).pathname);
      if (match) {
        return { email, surveyId: match.surveyId, choice: match.choice};
      }
    })
    .compact()
    .uniqBy("email", "surveyId")
    .value();

    console.log(events);

    res.send({});
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    const recipientEmails = recipients.split(",").map(email => ({ email: email.trim() }));
    const survey = new Survey({
      surveyId: require("uuid/v1")(),
      title,
      subject,
      body,
      recipients: recipientEmails,
      _user: req.user.userId,
      dateSent: Date.now()
    });

    try {
      await survey.save(undefined,undefined,
      //val => {
      //   console.log(val.Item.recipients); 
      //   val.Item.recipients = { L: [{ M: { email: { S: "samirpatelgx@gmail.com" } }}] };
      //   return val;
      // }
      undefined);
      const mailer = new Mailer(survey, surveyTemplate(survey));
      await mailer.send();
      //await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
    
  });
};