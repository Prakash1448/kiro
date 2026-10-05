// User service with various issues for demonstration

interface User {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  private users: User[] = [];
  
  async createUser(name: string, email: string): Promise<User> {
    // FIXME: Add email validation
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email
    };
    
    console.log('Creating user:', user); // Debug statement
    this.users.push(user);
    return user;
  }
  
  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }
  
  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = await this.getUserById(id);
    if (user) {
      Object.assign(user, updates);
      return user;
    }
    return undefined;
  }
  
  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
  
  async getAllUsers(): Promise<User[]> {
    console.warn('Fetching all users'); // Debug statement
    return [...this.users];
  }
}
