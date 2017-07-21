"use strict";

const status = require('../status'),
      Survey  = require('../models/survey'),
      UserFolder  = require('../models/userFolder'),
      jsonfile = require('jsonfile'),
      crypto = require('crypto'),
      fs = require('fs'),
      config = require('config'),
      json2csv = require('json2csv'),
      temp = require('temp'),
      util = require('util'),
      mongoose = require('mongoose'),
      val = require('../libs/validation.js');



exports.createUserFolder = (req, res, next) => {
  let receivedFolder = req.body;

  // make sure it isn't just an empty object.
  if (Object.keys(receivedFolder).length === 0) {
    return res.status(400).send( {message: status.SURVEY_OBJECT_MISSING.message, status: status.SURVEY_OBJECT_MISSING.code})
  } // FIXME: Status needs updating above and below
  if (!val.centerValidation(receivedCenter)){
    return res.status(422).send( {message: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code})
  }
  receivedFolder.isRoot = false;
  let newCenter = new Center ( receivedCenter )

  // FIXME: change the "next(err)" so that it returns a json object akin to the above instead
  newCenter.save((err, center) => {
    if (err) {return next(err); }
    return res.status(200).send( center );
  })
}

// GET
exports.getUserFolders = (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).send({message: 'fixme'});
  }

  UserFolder.find( {user: userId}).populate({
     path: 'surveys',
     model: 'Survey'
  }).exec(function(err, folders) {
    if (!folders || folders.length === 0) {
      // FIXME wrong error message
      return res.status(500).send({message: 'fixme'});
    }
    if (err) { return next(err); }
    console.log(folders);
    return res.status(200).send(folders);
  });
}

// DELETE
exports.deleteUserFolder = (req, res, next) => {
  // write me.
  // ).lean();
}
