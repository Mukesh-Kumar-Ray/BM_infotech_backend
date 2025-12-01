// **** Stores user submissions for a form
import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: {},                // flexible object with field IDs as keys
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Response', ResponseSchema);
