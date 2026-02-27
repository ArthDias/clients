import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ClientDocument = Client & Document;

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, unique: true })
  document!: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
