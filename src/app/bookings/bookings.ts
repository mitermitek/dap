import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { Component, linkedSignal, signal } from '@angular/core';
import { BookingList } from './booking-list/booking-list';
import { TABS, TabType } from './bookings.data';
import { CreateBooking } from './create-booking/create-booking';
import { DisplayTabNamePipe } from './display-tab-name-pipe';

@Component({
  imports: [
    TabList,
    Tab,
    Tabs,
    TabPanel,
    TabContent,

    BookingList,
    CreateBooking,
    DisplayTabNamePipe,
  ],
  selector: 'app-bookings',
  styleUrl: './bookings.css',
  templateUrl: './bookings.html',
})
export class Bookings {
  protected tabList = signal<TabType[]>(TABS);
  protected selectedTab = linkedSignal(() => this.tabList()[0]);
}
