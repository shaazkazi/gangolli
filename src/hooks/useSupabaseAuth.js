import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export function useSupabaseAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  return { user }
}
