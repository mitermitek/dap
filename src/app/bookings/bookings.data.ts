import { Format } from '../formats/formats.data';

export interface Booking {
  id: string;
  date: string;
  time: string;
  format: Format;
}

export type TabType = 'new_request' | 'ongoing_requests';
export const TABS: TabType[] = ['new_request', 'ongoing_requests'];
export const TAB_NAMES: Record<TabType, string> = {
  new_request: 'Nouvelle demande',
  ongoing_requests: 'Demandes en cours',
};
