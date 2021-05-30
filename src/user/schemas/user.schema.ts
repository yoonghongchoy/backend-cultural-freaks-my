import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Gender {
  male = 'Male',
  female = 'Female',
  custom = 'Custom',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ required: true })
  gender: Gender;
}

export const UserSchema = SchemaFactory.createForClass(User);
