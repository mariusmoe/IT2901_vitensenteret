"use strict";

const validator = require('validator'),
      status = require('../status'),
      Survey = require('../models/survey'),
      jsonfile = require('jsonfile'),
      fs = require('fs'),
      config = require('config'),
      json2csv = require('json2csv'),
      temp = require('temp'),
      util = require('util'),
      val = require('../libs/validation.js');

// Automatically track and cleanup files at exit
temp.track();



// POST
exports.createSurvey = (req, res, next) => {
  let receivedSurvey = req.body;

  // make sure it isn't just an empty object.
  if (Object.keys(receivedSurvey).length === 0) {
    return res.status(400).send( {message: status.SURVEY_OBJECT_MISSING.message, status: status.SURVEY_OBJECT_MISSING.code})
  }
  if (!val.surveyValidation(receivedSurvey)){
    return res.status(422).send( {message: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code})
  }

  let newSurvey = new Survey ( receivedSurvey )

  newSurvey.save((err, survey) => {
    if (err) {return next(err); }
    return res.status(200).send( survey );
  })
}


// GET
exports.getAllSurveys = (req, res, next) => {
  // TODO: Change me so that I return only id and name!

  Survey.find( {}, (err, surveys) => {
    if (!surveys) {
      // essentially means not one survey exists that match {} - i.e. 0 surveys in db? should be status: 200, empty list then?
      return res.status(200).send({message: status.ROUTE_SURVEYS_VALID_NO_SURVEYS.message, status: status.ROUTE_SURVEYS_VALID_NO_SURVEYS.code});
    }
    if (err) { return next(err); }

    let surveyList = [];
    for (let survey of surveys) {
      surveyList[surveyList.length] = {
        'name': survey.name,
        'active': survey.active,
        'date': survey.date,
      }
    }

    return res.status(200).send(surveyList);
  });

}
exports.getOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;
  // ROUTER checks for existence of surveyId. no need to have a check here as well.
  Survey.findById( surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    return res.status(200).send(survey);
  });
}



// PATCH
exports.patchOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;
  // ROUTER checks for existence of surveyId. no need to have a check here as well.

  let survey = req.body;
  // make sure it isn't just an empty object.
  if (Object.keys(survey).length === 0) {
    return res.status(400).send( {message: status.SURVEY_OBJECT_MISSING.message, status: status.SURVEY_OBJECT_MISSING.code})
  }
  if (!val.surveyValidation(survey)){
    return res.status(422).send( {message: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code})
  }
  // Set ID
  survey._id = surveyId;
  Survey.findByIdAndUpdate( surveyId, {$set: survey, $inc: { __v: 1 }}, {new: true, }, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }
    return res.status(200).send({message: status.SURVEY_UPDATED.message, status: status.SURVEY_UPDATED.code, survey: survey})
  });
}

// DELETE
exports.deleteOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId
  // ROUTER checks for existence of surveyId. no need to have a check here as well.

  Survey.findByIdAndRemove( surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }
    return res.status(200).send({message: 'Success! - it is no more'});
  });
}


// JSON


exports.getAllSurveysAsJson = (req, res, next) => {
  Survey.find({}, (err, surveys) => {
    if (!surveys) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    const file = 'temp/data.json';

    jsonfile.writeFile(file, surveys, {spaces: 2}, function(err) {
      // return res.status(200).download( file );
      res.download(file, 'report.pdf', function(err){
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
          });
      } else {
        // decrement a download credit, etc.
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          // console.log(config.util.getEnv('NODE_ENV'));
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
        });
      }
      });
    });
  });
}

exports.getSurveyAsJson = (req, res, next) => {
  const surveyId = req.params.surveyId
  if (!surveyId) {
    return res.status(400).send( {message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code})
  }
  Survey.findById(surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    const file = 'temp/data.json';

    jsonfile.writeFile(file, survey, {spaces: 2}, function(err) {
      // return res.status(200).download( file );
      // TODO: GIVE THE REPORT A BETTER NAME!
      res.download(file, 'report.json', function(err){
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
          });
      } else {
        // decrement a download credit, etc.
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          // console.log(config.util.getEnv('NODE_ENV'));
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
        });
      }
      });
    });
  });
}


// ,
// exec = require('child_process').exec;



// Fake data
var myData = "foo\nbar\nfoo\nbaz";




exports.getSurveyAsCSV = (req, res, next) => {
    const surveyId = req.params.surveyId
    if (!surveyId) {
      return res.status(400).send( {message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code})
    }
    Survey.findById(surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    const file = 'temp/data.csv';

    let myList  = [];
    let questionAnswar = []
    let fields  = ['1', '2', '3', '4','5','6'];
    let csv = "";

      // for every question in the survey
      for (let question of survey.questionlist){
        questionAnswar = question.answer;
        // Count the occurance of each element in the array
        let questionAnswarCount = new Map([...new Set(questionAnswar)].map(
            x => [x, questionAnswar.filter(y => y === x).length]
        ));
        // console.log(questionAnswarCount);

        csv += question.lang.no.txt + '\n'
        // console.log(question.lang.no.options);
        // for (let i of question.lang.no.options) {
        //   console.log(i);
        //   text += i + ','
        // }
        question.lang.no.options.forEach( (x) =>{csv += x + ','})
        csv += '\n'
        // for (let u = 1; u < question.lang.no.options.length+1; u++) {
        //   text += questionAnswarCount.get(u) + ','
        // }
        question.lang.no.options.forEach( (x,y) => { csv += questionAnswarCount.get(y+1) + ',' })
        csv += '\n'
        // console.log(text);


        // myList.push({
        //   "1": question.lang.no.txt
        // });
        // myList.push({
        //   "1": question.lang.no.options[0],
        //   "2": question.lang.no.options[1],
        //   "3": question.lang.no.options[2],
        //   "4": question.lang.no.options[3],
        //   "5": question.lang.no.options[4],
        //   "6": question.lang.no.options[5],
        // });
        // myList.push({
        //   "1": questionAnswarCount.get(1),
        //   "2": questionAnswarCount.get(2),
        //   "3": questionAnswarCount.get(3),
        //   "4": questionAnswarCount.get(4),
        //   "5": questionAnswarCount.get(5),
        //   "6": questionAnswarCount.get(6),
        // });
      }

    // Create a CSV file
    // let csv = json2csv({ data: myList, fields: fields });
    // // Delete fieds - we dont want them
    // let lines = csv.split('\n');
    // lines.splice(0,1);
    // csv = lines.join('\n');
    //
    // csv = text

    // Open a gate to the temp directory
    temp.open('myprefix', function(err, info) {
      if (!err) {
        fs.write(info.fd, csv, function(err){
          if (err) {console.error(err);}
        });
        // close file system operation (it is now safe to read from file)
        fs.close(info.fd, function(err) {
          res.download(info.path, 'data.csv', function(err){
            if (err) {console.error(err);}
          })
        });
      }
    });

  });
}
