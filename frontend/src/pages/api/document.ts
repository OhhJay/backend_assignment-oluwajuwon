import { apiClient } from '@/utils/apiClient';
import { CreateSampleData } from '@/interfaces/document.interface';

// In @/pages/api/document.ts
export const submitDocumentJson = async (formData: FormData) => {
    try {
        console.log(formData.keys)
      const response = await apiClient('/documents', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit document.');
      }
  
      return response.json();
    } catch (err) {
      throw new Error('Failed to submit document.');
    }
  };


  export const submitFile = async (formData: FormData) => {
    try {
        console.log(formData.keys)
      const response = await apiClient('/documents/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit file.');
      }
  
      return response.json();
    } catch (err) {
      throw new Error('Failed to submit document.');
    }
  };

  export const deleteDoc = async(id:number) => {
    try{
    const response = await apiClient('/documents/'+id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }); 
    if (!(response.status==204)) {
      console.log('error response')
      throw new Error('Failed to delete document.');
    }

    return response;
  } catch (err) {
    console.log(err)
    return {
      status:400,
      error:'unable to upload document'
    } 
  
  }
}