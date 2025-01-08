import { supabase } from '@/app/lib/supabase'
import { ApiKey } from '@/app/types/api'

export const apiKeyService = {
  async fetchApiKeys() {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createApiKey(name: string) {
    const keyNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    const newKey = {
      name,
      key: `key-number-${keyNumber}`,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateApiKey(id: string, name: string) {
    const { error } = await supabase
      .from('api_keys')
      .update({ name })
      .eq('id', id)

    if (error) throw error
  },

  async deleteApiKey(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 