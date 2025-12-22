const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true,'First name is required'],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true,'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true,'Password is required'],
    minlength: 8,
  },
  userType: {
    type: String,
    enum: ['', 'Candidate', 'Recruiter'],
    default: 'Candidate'
  },
  homes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  jobsApplied: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }]
}); 

userSchema.pre('save', function(next) {
  if (this.userType !== 'Recruiter') {
    this.homes = [];
  }
  next();
});

module.exports = mongoose.model('User', userSchema);