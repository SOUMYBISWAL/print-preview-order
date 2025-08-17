import { generateClient } from 'aws-amplify/data'
import { uploadData, getUrl, remove, list } from 'aws-amplify/storage'
import type { Schema } from '../../amplify/data/resource'

// Generate the Amplify data client
export const client = generateClient<Schema>()

// Storage utilities for file management
export const storageUtils = {
  // Upload file to S3
  uploadFile: async (file: File, key: string) => {
    try {
      const result = await uploadData({
        key: `documents/${key}`,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result
      return result
    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  },

  // Get file download URL
  getFileUrl: async (key: string) => {
    try {
      const result = await getUrl({
        key: `documents/${key}`,
        options: {
          expiresIn: 3600, // 1 hour
        },
      })
      return result.url
    } catch (error) {
      console.error('Get file URL error:', error)
      throw error
    }
  },

  // Delete file from S3
  deleteFile: async (key: string) => {
    try {
      await remove({ key: `documents/${key}` })
      return true
    } catch (error) {
      console.error('File delete error:', error)
      throw error
    }
  },

  // List all files in storage
  listFiles: async () => {
    try {
      const result = await list({
        prefix: 'documents/',
      })
      return result.items
    } catch (error) {
      console.error('List files error:', error)
      throw error
    }
  },
}

// DynamoDB operations for print orders
export const printOrderOperations = {
  // Create new print order
  createOrder: async (orderData: {
    files: string[]
    paperType: string
    colorOption: string
    printSides: string
    binding?: string
    quantity: number
    totalPages: number
    totalPrice: number
    customerEmail?: string
    customerPhone?: string
    notes?: string
  }) => {
    try {
      const result = await client.models.PrintOrder.create({
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      return result
    } catch (error) {
      console.error('Create order error:', error)
      throw error
    }
  },

  // Get all orders
  getAllOrders: async () => {
    try {
      const result = await client.models.PrintOrder.list()
      return result.data
    } catch (error) {
      console.error('Get orders error:', error)
      throw error
    }
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string) => {
    try {
      const result = await client.models.PrintOrder.update({
        id,
        status,
        updatedAt: new Date().toISOString(),
      })
      return result
    } catch (error) {
      console.error('Update order error:', error)
      throw error
    }
  },

  // Delete order
  deleteOrder: async (id: string) => {
    try {
      const result = await client.models.PrintOrder.delete({ id })
      return result
    } catch (error) {
      console.error('Delete order error:', error)
      throw error
    }
  },
}

// File metadata operations
export const fileMetadataOperations = {
  // Create file metadata record
  createFileMetadata: async (data: {
    fileName: string
    fileSize: number
    fileType: string
    s3Key: string
    pageCount?: number
    orderId?: string
  }) => {
    try {
      const result = await client.models.FileMetadata.create({
        ...data,
        uploadedAt: new Date().toISOString(),
      })
      return result
    } catch (error) {
      console.error('Create file metadata error:', error)
      throw error
    }
  },

  // Get all file metadata
  getAllFiles: async () => {
    try {
      const result = await client.models.FileMetadata.list()
      return result.data
    } catch (error) {
      console.error('Get file metadata error:', error)
      throw error
    }
  },

  // Delete file metadata
  deleteFileMetadata: async (id: string) => {
    try {
      const result = await client.models.FileMetadata.delete({ id })
      return result
    } catch (error) {
      console.error('Delete file metadata error:', error)
      throw error
    }
  },
}

// Print settings operations
export const printSettingsOperations = {
  // Create print settings template
  createTemplate: async (data: {
    name: string
    paperType: string
    colorOption: string
    printSides: string
    binding?: string
    isDefault?: boolean
  }) => {
    try {
      const result = await client.models.PrintSettings.create({
        ...data,
        createdAt: new Date().toISOString(),
      })
      return result
    } catch (error) {
      console.error('Create print settings error:', error)
      throw error
    }
  },

  // Get all templates
  getAllTemplates: async () => {
    try {
      const result = await client.models.PrintSettings.list()
      return result.data
    } catch (error) {
      console.error('Get print settings error:', error)
      throw error
    }
  },
}