import { FlightProvider, Offer, PricedOffer, SearchQuery, SeatMap, TicketInput, TicketResult } from '../providers/types';

export class DuffelProvider implements FlightProvider {
  constructor(private apiKey: string) {}

  async searchOffers(_q: SearchQuery): Promise<Offer[]> {
    throw new Error('Duffel provider not implemented');
  }

  async getSeatMap(_offerId: string): Promise<SeatMap[]> {
    throw new Error('Duffel provider not implemented');
  }

  async priceWithAncillaries(_offerId: string, _seatIds: string[]): Promise<PricedOffer> {
    throw new Error('Duffel provider not implemented');
  }

  async selectSeats(_offerId: string, _seatIds: string[]): Promise<void> {
    throw new Error('Duffel provider not implemented');
  }

  async bookAndTicket(_input: TicketInput): Promise<TicketResult> {
    throw new Error('Duffel provider not implemented');
  }
}
