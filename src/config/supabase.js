// Supabase configuration constants
export const SUPABASE_URL = 'https://htwlwwtedwbiaqyaquwh.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0d2x3d3RlZHdiaWFxeWFxdXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2MDQxNDYsImV4cCI6MjA1NDE4MDE0Nn0.02dhZCzZyqtbHlNgAcbE6cT3i-6ZLNdfSZlSpeRsDgo'

// Storage configuration
export const STORAGE_BUCKET = 'gangolli'
export const STORAGE_URL = 'https://htwlwwtedwbiaqyaquwh.supabase.co/storage/v1/s3'
export const STORAGE_KEY_ID = 'e01fb00bec375ee7a9877e36573cf9ce'
export const STORAGE_SECRET_KEY = 'fc066c26ca86397db20d87311f73ff3b1fbe9738fbd34d9ead665919b7faf7d5'

// API endpoints
export const API_ENDPOINTS = {
  POSTS: 'posts',
  CATEGORIES: 'categories',
  PROFILES: 'profiles'
}

// Table relationships
export const TABLE_RELATIONSHIPS = {
  POSTS: {
    CATEGORIES: 'categories (*)',
    PROFILES: 'profiles (*)'
  }
}

// Query limits
export const QUERY_LIMITS = {
  POSTS_PER_PAGE: 10,
  RELATED_POSTS: 3
}
