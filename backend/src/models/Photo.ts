import { Schema, model, Types, Document } from 'mongoose';

export interface IPhoto extends Document {
  user: Types.ObjectId;
  filePath: string;        // <-- lo agregamos aquí
  url: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  tags: string[];
  event?: string;
  dateTaken: Date;
  uploadDate: Date;
}

const photoSchema = new Schema<IPhoto>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    filePath: { type: String, required: true },       // <-- y aquí
    url: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    event: { type: String },
    dateTaken: { type: Date, default: () => new Date() },
    uploadDate: { type: Date, default: () => new Date() },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Photo = model<IPhoto>('Photo', photoSchema);
