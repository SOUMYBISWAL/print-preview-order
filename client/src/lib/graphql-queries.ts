/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGuestOrder = /* GraphQL */ `
  mutation CreateGuestOrder($input: CreateOrderInput!) {
    createGuestOrder(input: $input) {
      id
      customerName
      email
      phone
      totalAmount
      status
      totalPages
      printType
      paperSize
      paperType
      sides
      binding
      copies
      deliveryAddress
      paymentMethod
      paymentStatus
      fileNames
      fileKeys
      specialInstructions
      userID
      createdAt
      updatedAt
    }
  }
`;

export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        customerName
        email
        phone
        totalAmount
        status
        totalPages
        printType
        paperSize
        paperType
        sides
        binding
        copies
        deliveryAddress
        paymentMethod
        paymentStatus
        fileNames
        fileKeys
        specialInstructions
        userID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
      id
      customerName
      email
      phone
      totalAmount
      status
      totalPages
      printType
      paperSize
      paperType
      sides
      binding
      copies
      deliveryAddress
      paymentMethod
      paymentStatus
      fileNames
      fileKeys
      specialInstructions
      userID
      createdAt
      updatedAt
    }
  }
`;

export const updateOrderStatus = /* GraphQL */ `
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      customerName
      email
      phone
      totalAmount
      status
      totalPages
      printType
      paperSize
      paperType
      sides
      binding
      copies
      deliveryAddress
      paymentMethod
      paymentStatus
      fileNames
      fileKeys
      specialInstructions
      userID
      createdAt
      updatedAt
    }
  }
`;

export const getOrderByID = /* GraphQL */ `
  query GetOrderByID($id: ID!) {
    getOrderByID(id: $id) {
      id
      customerName
      email
      phone
      totalAmount
      status
      totalPages
      printType
      paperSize
      paperType
      sides
      binding
      copies
      deliveryAddress
      paymentMethod
      paymentStatus
      fileNames
      fileKeys
      specialInstructions
      userID
      createdAt
      updatedAt
    }
  }
`;

export const listOrdersForAdmin = /* GraphQL */ `
  query ListOrdersForAdmin {
    listOrdersForAdmin {
      id
      customerName
      email
      phone
      totalAmount
      status
      totalPages
      printType
      paperSize
      paperType
      sides
      binding
      copies
      deliveryAddress
      paymentMethod
      paymentStatus
      fileNames
      fileKeys
      specialInstructions
      userID
      createdAt
      updatedAt
    }
  }
`;