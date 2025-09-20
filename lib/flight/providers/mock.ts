import {
  FlightProvider,
  Offer,
  PricedOffer,
  SearchQuery,
  SeatMap,
  TicketInput,
  TicketResult
} from './types';

const mockSegments = [
  {
    id: 'SEG1',
    origin: 'CAI',
    destination: 'JED',
    departure: new Date().toISOString(),
    arrival: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    carrier: 'MS',
    duration: 'PT3H'
  },
  {
    id: 'SEG2',
    origin: 'JED',
    destination: 'MED',
    departure: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    arrival: new Date(Date.now() + 6.5 * 3600 * 1000).toISOString(),
    carrier: 'SV',
    duration: 'PT1H30M'
  }
];

export class MockFlightProvider implements FlightProvider {
  async searchOffers(_q: SearchQuery): Promise<Offer[]> {
    return [
      {
        id: 'OFFER1',
        provider: 'mock',
        totalAmount: 350,
        currency: 'USD',
        segments: mockSegments
      },
      {
        id: 'OFFER2',
        provider: 'mock',
        totalAmount: 420,
        currency: 'USD',
        segments: mockSegments
      }
    ];
  }

  async getSeatMap(offerId: string): Promise<SeatMap[]> {
    const seats = Array.from({ length: 24 }).map((_, idx) => {
      const row = Math.floor(idx / 6) + 1;
      const seat = String.fromCharCode(65 + (idx % 6));
      const id = `${offerId}-${row}${seat}`;
      const available = idx % 7 !== 0;
      const type = row === 1 ? 'extra_legroom' : row === 10 ? 'exit' : 'standard';
      return {
        id,
        label: `${row}${seat}`,
        type,
        available,
        price: type === 'standard' ? 0 : type === 'exit' ? 40 : 25,
        currency: 'USD'
      };
    });

    return [
      {
        segmentId: mockSegments[0].id,
        deck: 'main',
        seats
      },
      {
        segmentId: mockSegments[1].id,
        deck: 'main',
        seats: seats.map((s, idx) => ({
          ...s,
          id: `${offerId}-LEG2-${idx}`
        }))
      }
    ];
  }

  async priceWithAncillaries(offerId: string, seatIds: string[]): Promise<PricedOffer> {
    const seatMaps = await this.getSeatMap(offerId);
    const seats = seatMaps
      .flatMap((map) => map.seats)
      .filter((seat) => seatIds.includes(seat.id));
    const seatTotal = seats.reduce((acc, seat) => acc + (seat.price || 0), 0);
    const base = offerId === 'OFFER2' ? 420 : 350;
    return {
      offerId,
      totalAmount: base + seatTotal,
      currency: 'USD',
      seatSelections: seats
    };
  }

  async selectSeats(_offerId: string, _seatIds: string[]): Promise<void> {
    // No-op in mock provider; assume success
  }

  async bookAndTicket(input: TicketInput): Promise<TicketResult> {
    return {
      recordLocator: 'GH' + Math.random().toString().slice(2, 8),
      ticketNumbers: input.passengers.map((_, idx) => `181-${Math.floor(Math.random() * 1e6)}${idx}`),
      documents: [
        {
          type: 'eticket',
          url: `${process.env.SITE_URL || 'http://localhost:3000'}/api/invoices/mock-ticket.pdf`
        }
      ]
    };
  }
}
