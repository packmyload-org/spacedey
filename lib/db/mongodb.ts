import { MongoClient, Db, Collection } from 'mongodb';
import { User, Site, UnitType } from '@/lib/types/local';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spacedey';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDB(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedDb = client.db('spacedey');
  cachedClient = client;

  return cachedDb;
}

export async function getCollection<T = any>(collectionName: string): Promise<Collection<T>> {
  const db = await connectToDB();
  return db.collection<T>(collectionName);
}

// User operations
export async function getUserByEmail(email: string): Promise<User | null> {
  const collection = await getCollection<User>('users');
  return collection.findOne({ email: email.toLowerCase() });
}

export async function getUserById(id: string): Promise<User | null> {
  const collection = await getCollection<User>('users');
  return collection.findOne({ _id: id } as any);
}

export async function createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const collection = await getCollection<User>('users');
  
  // Check if user already exists
  const existing = await getUserByEmail(user.email);
  if (existing) {
    throw new Error('User already exists');
  }

  const result = await collection.insertOne({
    ...user,
    email: user.email.toLowerCase(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any);

  return {
    id: result.insertedId.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    passwordHash: user.passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateUserPassword(email: string, passwordHash: string): Promise<boolean> {
  const collection = await getCollection<User>('users');
  const result = await collection.updateOne(
    { email: email.toLowerCase() },
    { $set: { passwordHash, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

// Site operations
export async function getSites(): Promise<Site[]> {
  const collection = await getCollection<Site>('sites');
  return collection.find({}).toArray();
}

export async function getSiteById(id: string): Promise<Site | null> {
  const collection = await getCollection<Site>('sites');
  return collection.findOne({ _id: id } as any);
}

export async function createSite(site: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>): Promise<Site> {
  const collection = await getCollection<Site>('sites');
  const result = await collection.insertOne({
    ...site,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any);

  return {
    id: result.insertedId.toString(),
    ...site,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Unit type operations
export async function getUnitTypesBySiteId(siteId: string): Promise<UnitType[]> {
  const collection = await getCollection<UnitType>('unitTypes');
  return collection.find({ siteId }).toArray();
}

export async function createUnitType(unitType: Omit<UnitType, 'id'>): Promise<UnitType> {
  const collection = await getCollection<UnitType>('unitTypes');
  const result = await collection.insertOne(unitType as any);

  return {
    id: result.insertedId.toString(),
    ...unitType,
  };
}
