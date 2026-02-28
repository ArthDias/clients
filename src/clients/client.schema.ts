import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Client {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 120,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email!: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    index: true,
  })
  document!: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
