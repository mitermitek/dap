import { Service } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Format } from './formats.data';

@Service()
export class FormatsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabasePublishableKey);
  }

  async getFormats(): Promise<Format[]> {
    const { data, error } = await this.supabase
      .from('formats')
      .select('id, name, description')
      .eq('active', true)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching formats:', error);
      throw error;
    }

    return data;
  }
}
