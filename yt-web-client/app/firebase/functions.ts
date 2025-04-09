import {getFunctions, httpsCallable} from 'firebase/functions';
import { functions } from './firebase';

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunctions = httpsCallable(functions, 'getVideos');

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string  
  }

export async function uploadVideo(file: File) {

    const response: any = await generateUploadUrl({
        fileExtension: file.name.split('.').pop()
    })

    await fetch(response?.data?.url, {
        method: "PUT",
        body: file, 
        headers: {
            'Content-Type': file.type
        }
    });

    return;
}

export async function getVideos() {
    const response: any = await getVideosFunctions();
    return response.data as Video[];
}