import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { Booking } from '../bookings.data';
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
  protected bookingIdToDelete = signal<string | undefined>(undefined);

  protected errorMessage = signal<string | undefined>(undefined);

  protected addBookingToCalendar(booking: Booking): void {
    const start = new Date(`${booking.date}T${booking.time}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const toIcsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `UID:${booking.id}@dap.mitermitek.fr`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${booking.format.name}`,
      `DESCRIPTION:${booking.format.description}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `dap-rdv-${booking.id}.ics`;
    link.click();

    URL.revokeObjectURL(url);
  }

  protected async removeBooking(bookingId: string): Promise<void> {
    this.bookingIdToDelete.set(bookingId);
    this.errorMessage.set(undefined);

    try {
      await this.bookingsService.removeBooking(bookingId);

      const removedBookingIndex = this.bookings().findIndex((booking) => booking.id === bookingId);
      this.bookings().splice(removedBookingIndex, 1);
    } catch (error) {
      this.errorMessage.set(
        "La demande n'a pas pu être clôturée. Réessayez, ou contactez votre conseiller.",
      );
    } finally {
      this.bookingIdToDelete.set(undefined);
    }
  }
}
