import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findOne } from './mongodb/utils';
import User from './mongodb/models/User';

// JWT token expiration time (e.g., 24 hours)
const TOKEN_EXPIRATION = '24h';

/**
 * Generate a JWT token for a user
 * @param userId User ID
 * @param role User role
 * @returns JWT token
 */
export function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: TOKEN_EXPIRATION }
  );
}

/**
 * Verify a JWT token
 * @param token JWT token
 * @returns Decoded token data or null if invalid
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    return null;
  }
}

/**
 * Hash a password
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a password with a hash
 * @param password Plain text password
 * @param hash Hashed password
 * @returns True if password matches hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Authenticate a user with email and password
 * @param email User email
 * @param password User password
 * @returns User object and token if authentication successful, null otherwise
 */
export async function authenticateUser(email: string, password: string): Promise<{ user: any; token: string } | null> {
  const user = await findOne(User, { email });
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  const token = generateToken(user._id.toString(), user.role);
  
  return { user, token };
} 