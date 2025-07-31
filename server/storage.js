// In-memory storage implementation for Replit environment
// This replaces database functionality for development

class MemoryStorage {
  constructor() {
    this.orders = [];
    this.users = [];
    this.nextOrderId = 1;
    this.nextUserId = 1;
    
    console.log("MemoryStorage initialized");
    
    // Add some sample data for testing
    this.orders.push({
      id: this.nextOrderId++,
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "1234567890",
      deliveryAddress: "123 Main St, City, State 12345",
      files: [
        {
          fileName: "sample-document.pdf",
          fileSize: 204800,
          fileType: "application/pdf",
          estimatedPages: 1
        }
      ],
      printSettings: {
        paperType: "70GSM",
        colorOption: "black-white",
        printSides: "single",
        bindingOption: "none",
        copies: 1
      },
      totalPages: 1,
      totalPrice: 2.5,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  async createOrder(orderData) {
    const order = {
      id: this.nextOrderId++,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.orders.push(order);
    console.log(`Created order with ID: ${order.id}`);
    return order;
  }

  async getAllOrders() {
    return this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getOrder(id) {
    return this.orders.find(order => order.id === id);
  }

  async updateOrder(id, updateData) {
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return null;
    }

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    console.log(`Updated order ID: ${id}`);
    return this.orders[orderIndex];
  }

  async deleteOrder(id) {
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return false;
    }

    this.orders.splice(orderIndex, 1);
    console.log(`Deleted order ID: ${id}`);
    return true;
  }

  async createUser(userData) {
    const user = {
      id: this.nextUserId++,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.users.push(user);
    console.log(`Created user with ID: ${user.id}`);
    return user;
  }

  async getUser(id) {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username) {
    return this.users.find(user => user.username === username);
  }

  async getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  // Analytics methods
  async getOrderStats() {
    const total = this.orders.length;
    const pending = this.orders.filter(o => o.status === 'pending').length;
    const processing = this.orders.filter(o => o.status === 'processing').length;
    const completed = this.orders.filter(o => o.status === 'delivered').length;
    
    const totalRevenue = this.orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    return {
      total,
      pending,
      processing,
      completed,
      totalRevenue
    };
  }
}

// Export a singleton instance
export const storage = new MemoryStorage();