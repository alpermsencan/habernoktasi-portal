import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INewsDocument extends Document {
  guid: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  sourceLink: string;
  sourceName: string;
  category: string;
  imageUrl: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INewsDocument>(
  {
    guid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    summary: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    sourceLink: {
      type: String,
      required: true,
      unique: true,
    },
    sourceName: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      default: 'Gündem',
      index: true,
    },
    imageUrl: {
      type: String,
      default: '/placeholder.webp',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: -1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for category and date sorting
NewsSchema.index({ category: 1, publishedAt: -1 });

export const NewsModel: Model<INewsDocument> =
  mongoose.models.News || mongoose.model<INewsDocument>('News', NewsSchema);

export default NewsModel;
