import { supabase } from './supabaseClient'
import { STORAGE_BUCKET } from '../config/supabase'

const BUNNY_STORAGE_URL = import.meta.env.VITE_BUNNY_STORAGE_URL
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_STORAGE_API_KEY
const BUNNY_PULLZONE = 'https://gangolliassets.b-cdn.net'

export const uploadImage = async (file) => {
  try {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}`

    const response = await fetch(`${BUNNY_STORAGE_URL}/${fileName}`, {
      method: 'PUT',
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Content-Type': file.type
      },
      body: file
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const imageUrl = `${BUNNY_PULLZONE}/${fileName}`
    return imageUrl
  } catch (error) {
    console.error('Image upload error:', error)
    throw error
  }
}
