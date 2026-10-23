// This script generates a secure random string for JWT_SECRET
import { randomBytes } from 'crypto';
const secret = randomBytes(32).toString('hex');
console.log('Your secure JWT_SECRET:');
console.log(`JWT_SECRET=${secret}`);
console.log('\nCopy this into your .env file');
