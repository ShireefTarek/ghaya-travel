export type SearchQuery = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabin?: 'economy' | 'premium_economy' | 'business' | 'first';
  adults: number;
  children?: number;
  infants?: number;
  multiCity?: {
    origin: string;
    destination: string;
    departureDate: string;
  }[];
};

export type Offer = {
  id: string;
  provider: string;
  totalAmount: number;
  currency: string;
  segments: Segment[];
};

export type Segment = {
  id: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  carrier: string;
  duration: string;
};

export type SeatMap = {
  segmentId: string;
  deck: string;
  seats: Seat[];
};

export type Seat = {
  id: string;
  label: string;
  type: 'standard' | 'exit' | 'extra_legroom' | 'paid';
  available: boolean;
  price?: number;
  currency?: string;
};

export type PricedOffer = {
  offerId: string;
  totalAmount: number;
  currency: string;
  seatSelections: Seat[];
};

export type TicketInput = {
  offerId: string;
  passengers: {
    firstName: string;
    lastName: string;
    email: string;
  }[];
  seats: string[];
};

export type TicketResult = {
  recordLocator: string;
  ticketNumbers: string[];
  documents: {
    type: 'eticket';
    url: string;
  }[];
};

export interface FlightProvider {
  searchOffers(q: SearchQuery): Promise<Offer[]>;
  getSeatMap(offerId: string): Promise<SeatMap[]>;
  priceWithAncillaries(offerId: string, seatIds: string[]): Promise<PricedOffer>;
  selectSeats(offerId: string, seatIds: string[]): Promise<void>;
  bookAndTicket(input: TicketInput): Promise<TicketResult>;
}
