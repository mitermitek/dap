import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { from } from 'rxjs';
import { FormatsService } from '../../formats/formats.service';
import { BookingsService } from '../bookings.service';
import { CreateBookingRequest } from './create-booking.data';

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-create-booking',
  styleUrl: './create-booking.css',
  templateUrl: './create-booking.html',
})
export class CreateBooking {
  private readonly formatsService = inject(FormatsService);
  private readonly bookingsService = inject(BookingsService);

  protected formats = toSignal(from(this.formatsService.getFormats()), { initialValue: [] });

  protected bookingForm = form(
    signal<CreateBookingRequest>({
      date: '',
      time: '',
      format_id: '',
    }),
    (schemaPath) => {
      required(schemaPath.date);
      required(schemaPath.time);
      required(schemaPath.format_id);
    },
    {
      submission: {
        action: async (field) => {
          this.resetMessages();

          const value = field().value();

          try {
            await this.bookingsService.createBooking(value);

            this.bookingForm().reset();

            this.successMessage.set(
              'La demande a bien été transmise à nos services. Vous pouvez retrouver votre demande dans l\'onglet "Demandes en cours". Le Département des Affaires Personnelles vous remercie.',
            );
          } catch (error) {
            this.errorMessage.set(
              "La demande n'a pas pu être traitée par nos services. Ce n'est pas vous, c'est le serveur.",
            );
          }
        },
      },
    },
  );

  protected successMessage = signal<string | undefined>(undefined);
  protected errorMessage = signal<string | undefined>(undefined);

  private resetMessages(): void {
    this.successMessage.set(undefined);
    this.errorMessage.set(undefined);
  }
}
