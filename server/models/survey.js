const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
/*
 |--------------------------------------------------------------------------
 | Survey schema
 |--------------------------------------------------------------------------
*/

// IF THIS CHANGES, DO UPDATE libs/validation.js!!
const SurveySchema = new Schema({
  name: {
    type: String
  },
	date: Date,
  active: Boolean,
	questionlist: [{
    mode: {
        type: String,
        enum: ['smily', 'text'],
        default: 'smily'
      },
		eng: {
			txt: String,
			options: [String]
			},
		nor: {
			txt: String,
			options: [String]
    },
		answer: [Number]
  }]
});


module.exports = mongoose.model('Survey', SurveySchema);
