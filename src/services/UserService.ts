import { Db, ObjectId } from 'mongodb';
import type { User, CreateUserDto, UpdateUserDto, LoginDto } from '../models/User';
import { hashPassword, comparePasswords, generateAuthToken } from '../utils/auth';

export class UserService {
  private collection;

  constructor(private db: Db) {
    this.collection = this.db.collection<User>('users');
  }

  async findAll(): Promise<User[]> {
    return await this.collection.find().toArray();
  }

  async findById(id: string): Promise<User | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.collection.findOne({ email });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const now = new Date();
    const hashedPassword = await hashPassword(createUserDto.password);
    
    const newUser: User = {
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || 'user',
      createdAt: now,
      updatedAt: now
    };
    
    const result = await this.collection.insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  }

  async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password'>, token: string } | { error: string }> {
    const user = await this.findByEmail(loginDto.email);
    
    if (!user) {
      return { error: 'User not found' };
    }
    
    const isPasswordValid = await comparePasswords(loginDto.password, user.password);
    if (!isPasswordValid) {
      return { error: 'Invalid password' };
    }
    
    const { password, ...userWithoutPassword } = user;
    
    const token = await generateAuthToken(user);
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateUserDto,
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    );
    
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async changePassword(id: string, password: string): Promise<boolean> {
    const newPassword = await hashPassword(password);
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { password: newPassword, updatedAt: new Date() } }
    );
    
    return result.modifiedCount === 1;
  }
} 