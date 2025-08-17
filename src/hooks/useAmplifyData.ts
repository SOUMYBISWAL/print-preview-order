import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  printOrderOperations, 
  fileMetadataOperations, 
  printSettingsOperations, 
  storageUtils 
} from '../lib/amplify-client'

// Print Orders hooks
export const usePrintOrders = () => {
  return useQuery({
    queryKey: ['printOrders'],
    queryFn: printOrderOperations.getAllOrders,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export const useCreatePrintOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: printOrderOperations.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printOrders'] })
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      printOrderOperations.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printOrders'] })
    },
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: printOrderOperations.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printOrders'] })
    },
  })
}

// File Metadata hooks
export const useFileMetadata = () => {
  return useQuery({
    queryKey: ['fileMetadata'],
    queryFn: fileMetadataOperations.getAllFiles,
    refetchInterval: 30000,
  })
}

export const useCreateFileMetadata = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: fileMetadataOperations.createFileMetadata,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileMetadata'] })
    },
  })
}

export const useDeleteFileMetadata = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: fileMetadataOperations.deleteFileMetadata,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileMetadata'] })
    },
  })
}

// Storage hooks
export const useUploadFile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ file, key }: { file: File; key: string }) =>
      storageUtils.uploadFile(file, key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileMetadata'] })
    },
  })
}

export const useDeleteFile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: storageUtils.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fileMetadata'] })
    },
  })
}

export const useGetFileUrl = () => {
  return useMutation({
    mutationFn: storageUtils.getFileUrl,
  })
}

// Print Settings hooks
export const usePrintSettings = () => {
  return useQuery({
    queryKey: ['printSettings'],
    queryFn: printSettingsOperations.getAllTemplates,
  })
}

export const useCreatePrintSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: printSettingsOperations.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printSettings'] })
    },
  })
}