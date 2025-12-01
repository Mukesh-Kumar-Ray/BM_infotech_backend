// **** Form schema stores the structure (JSON) and metadata
import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema({
  id: String,                 // unique id for field
  label: String,
  type: String,               // text, textarea, select, radio, checkbox, number, date
  options: [String],          // for select/radio/checkbox group
  required: { type: Boolean, default: false }
}, { _id: false });

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  // fields is an array of FieldSchema - defines the form layout
  fields: [FieldSchema],
  style: {
    themeColor: { type: String, default: '#0ea5e9' },
    fontFamily: { type: String, default: 'Inter, sans-serif' }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Form', FormSchema);
