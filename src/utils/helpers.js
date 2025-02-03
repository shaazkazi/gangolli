import { supabase } from './supabaseClient'
import { uploadToBunnyCDN } from './bunnycdn'

const BUNNY_PULLZONE = 'https://gangolliassets.b-cdn.net'

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  const fileName = imageUrl.split('/').pop().split('?')[0]
  return `${BUNNY_PULLZONE}/${fileName}`
}

export const api = {
  getPosts: async (page = 1, perPage = 10, search = '', category = '') => {
    let query = supabase
      .from('posts')
      .select(`
        *,
        categories (*),
        profiles (*)
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1)

    if (search) query = query.ilike('title', `%${search}%`)
    if (category) query = query.eq('category_id', category)

    return query
  },

  getPost: async (id) => {
    return supabase
      .from('posts')
      .select(`
        *,
        categories (*),
        profiles (*)
      `)
      .eq('id', id)
      .single()
  },

  createPost: async (postData) => {
    const imageUrl = await uploadToBunnyCDN(postData.image)
    
    return supabase
      .from('posts')
      .insert([{
        title: postData.title,
        content: postData.content,
        featured_image: imageUrl,
        category_id: postData.category
      }])
  }
}

export default api
