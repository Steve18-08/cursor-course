import { NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false,
          error: 'API key is required' 
        },
        { status: 200 }
      )
    }

    // Query Supabase to check if the API key exists and is valid
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single()

    if (error?.code === 'PGRST116') { // no rows returned
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid API key' 
        },
        { status: 200 }
      )
    }

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          success: false,
          error: 'Error validating API key' 
        },
        { status: 200 }
      )
    }

    // Update last_used timestamp
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', data.id)

    if (updateError) {
      console.error('Error updating last_used timestamp:', updateError)
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Valid API key', 
        key: data 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Server error' 
      },
      { status: 200 }
    )
  }
} 