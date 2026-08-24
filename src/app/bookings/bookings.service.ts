import { Service } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Booking } from './bookings.data';
import { CreateBookingRequest } from './create-booking/create-booking.data';

@Service()
export class BookingsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabasePublishableKey);
  }

  async getBookings(): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('id, date, time, format:formats!inner(id, name, description)')
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .overrideTypes<Booking[]>();

    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }

    return data;
  }

  async createBooking(createBookingRequest: CreateBookingRequest): Promise<void> {
    const { error } = await this.supabase.from('bookings').insert(createBookingRequest);

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async removeBooking(id: string): Promise<void> {
    const { error } = await this.supabase.from('bookings').delete().eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
}
