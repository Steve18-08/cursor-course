import { NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

async function validateApiKey(apiKey: string) {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single()

    if (error?.code === 'PGRST116' || !data) {
      return { isValid: false, error: 'Invalid API key' }
    }

    if (error) {
      console.error('Database error:', error)
      return { isValid: false, error: 'Error validating API key' }
    }

    // Update last_used timestamp
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', data.id)

    if (updateError) {
      console.error('Error updating last_used timestamp:', updateError)
    }

    return { isValid: true, data }
  } catch (error) {
    console.error('Validation error:', error)
    return { isValid: false, error: 'Server error during validation' }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { githubUrl } = body
    const apiKey = request.headers.get('x-api-key')

    // Validate required fields
    if (!apiKey || !githubUrl) {
      return NextResponse.json(
        { 
          success: false,
          error: !apiKey ? 'API key is required' : 'GitHub URL is required' 
        },
        { status: 400 } // Bad Request
      )
    }

    // Validate API key
    const { isValid, error } = await validateApiKey(apiKey)

    if (!isValid) {
      return NextResponse.json(
        { 
          success: false,
          error: error || 'Invalid API key'
        },
        { status: 401 } // Unauthorized
      )
    }

    // TODO: Add GitHub repository summarization logic here
    // For now, return a mock response
    return NextResponse.json(
      {
        success: true,
        data: {
          summary: "This is a mock summary of the GitHub repository",
          repository: githubUrl,
          analyzedAt: new Date().toISOString()
        }
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
      { status: 500 }
    )
  }
} 