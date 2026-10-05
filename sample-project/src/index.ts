// Main entry point for sample project

import { add, multiply } from './utils/calculator.js';
import { UserService } from './services/userService.js';

export async function main(): Promise<void> {
  console.log('Sample Project Started');
  
  // Math operations
  const sum = add(5, 3);
  const product = multiply(4, 7);
  
  console.log('Sum:', sum);
  console.log('Product:', product);
  
  // User operations
  const userService = new UserService();
  const user = await userService.createUser('John Doe', 'john@example.com');
  console.log('Created user:', user);
  
  // TODO: Add more functionality
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
