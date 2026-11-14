const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    date_of_joining: { type: Date, required: true },
    department: { type: String, required: true },

    // ① NEW: add inside the fields object, after your last field
    profile_picture: { type: String, default: null },

    // ② only if it's NOT already there (see note below)
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }   // ③ make sure this second argument exists
);

// ④ NEW: after the schema, before module.exports
employeeSchema.index({ owner: 1, department: 1 });
employeeSchema.index({ owner: 1, position: 1 });
employeeSchema.set('toJSON', { virtuals: true, versionKey: false });

module.exports = mongoose.model('Employee', employeeSchema);