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
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const newQuery = {
      projection: "surveyId, subject, yes, lastResponded, #_user, body, dateSent, title",
      // attributeNames: { "#user": "_user" }
    }
    const surveys = await Survey.query({ _user: req.user.userId }, newQuery);

    res.send(surveys);
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
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
    .each(({ surveyId, email, choice }) => {
      let keySchema = { surveyId: surveyId }
      let newQuery = {
        updateValues: `SET recipients.#email.responded = :update_responded, lastResponded = :curDate ADD ${choice} :add_choice`,
        conditionValues: `recipients.#email.responded = :curr_responded`,
        attributeNames: {
          "#email": email
        },
        attributeValues: { 
          ":update_responded": true,
          ":curr_responded": false,
          ":add_choice": 1,
          ":curDate": Date.now()
        },
        returnValues: "ALL_NEW"
      }
      Survey.update(keySchema, newQuery,(err,res) => {
        if (err) {
          console.log(err);
        }
        console.log(res);
      })
    })
    .value();

    res.send({});
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    const recipientEmails = {}
    recipients.split(",").forEach(email => (recipientEmails[email.trim()] = { clicked: false, responded: false } ));
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
      await survey.save();
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