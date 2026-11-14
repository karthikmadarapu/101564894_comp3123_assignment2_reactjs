const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // every query filters by user, so index it
    },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
    date_of_joining: { type: Date, required: true },
    department: { type: String, required: true, trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Email is unique per owner, not globally
employeeSchema.index({ user: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Employee', employeeSchema);
=======
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
>>>>>>> phase2-frontend
