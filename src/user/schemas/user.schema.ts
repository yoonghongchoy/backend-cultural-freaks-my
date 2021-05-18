import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Gender {
  male = 'Male',
  female = 'Female',
  custom = 'Custom',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  surName: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  gender: Gender;
}

export const UserSchema = SchemaFactory.createForClass(User);
