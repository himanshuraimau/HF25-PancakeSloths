import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import connectToDatabase from './index';

export async function findOne<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T>,
  options: { select?: string | Record<string, 0 | 1>; populate?: string } = {}
): Promise<T | null> {
  await connectToDatabase();
  let query = model.findOne(filter);
  
  if (options.select) {
    query = query.select(options.select);
  }
  
  if (options.populate) {
    query = query.populate(options.populate);
  }
  
  return query.exec();
}

export async function findMany<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T> = {},
  options: {
    select?: string | Record<string, 0 | 1>;
    populate?: string;
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
  } = {}
): Promise<T[]> {
  await connectToDatabase();
  let query = model.find(filter);
  
  if (options.select) {
    query = query.select(options.select);
  }
  
  if (options.populate) {
    query = query.populate(options.populate);
  }
  
  if (options.sort) {
    query = query.sort(options.sort);
  }
  
  if (options.skip) {
    query = query.skip(options.skip);
  }
  
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  return query.exec();
}

export async function createOne<T extends Document>(
  model: Model<T>,
  data: Partial<T>
): Promise<T> {
  await connectToDatabase();
  return model.create(data);
}

export async function updateOne<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T>,
  update: UpdateQuery<T>,
  options: { new?: boolean } = { new: true }
): Promise<T | null> {
  await connectToDatabase();
  return model.findOneAndUpdate(filter, update, options).exec();
}

export async function deleteOne<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T>
): Promise<boolean> {
  await connectToDatabase();
  const result = await model.deleteOne(filter).exec();
  return result.deletedCount === 1;
}

export async function count<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T> = {}
): Promise<number> {
  await connectToDatabase();
  return model.countDocuments(filter).exec();
}

export async function exists<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T>
): Promise<boolean> {
  await connectToDatabase();
  const result = await model.exists(filter);
  return result !== null;
} 