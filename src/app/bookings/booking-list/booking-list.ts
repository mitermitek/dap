import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { BookingsService } from '../bookings.service';

@Component({
  imports: [DatePipe],
  selector: 'app-booking-list',
  styleUrl: './booking-list.css',
  templateUrl: './booking-list.html',
})
export class BookingList {
  private readonly bookingsService = inject(BookingsService);

  protected bookings = toSignal(from(this.bookingsService.getBookings()), { initialValue: [] });
}
