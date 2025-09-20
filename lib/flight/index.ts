import { MockFlightProvider } from './providers/mock';
import type {
  FlightProvider,
  Offer,
  PricedOffer,
  SearchQuery,
  SeatMap,
  TicketInput,
  TicketResult
} from './providers/types';

// TODO: implement real Duffel or Amadeus providers.

function resolveProvider(): FlightProvider {
  const hasDuffel = !!process.env.DUFFEL_API_KEY;
  const hasAmadeus = !!process.env.AMADEUS_API_KEY;
  if (!hasDuffel && !hasAmadeus) {
    return new MockFlightProvider();
  }
  // For now return mock even if keys set until real integration is added.
  return new MockFlightProvider();
}

export async function searchFlightOffers(query: SearchQuery): Promise<Offer[]> {
  return resolveProvider().searchOffers(query);
}

export async function getSeatMaps(offerId: string): Promise<SeatMap[]> {
  return resolveProvider().getSeatMap(offerId);
}

export async function priceOfferWithSeats(offerId: string, seatIds: string[]): Promise<PricedOffer> {
  return resolveProvider().priceWithAncillaries(offerId, seatIds);
}

export async function selectSeats(offerId: string, seatIds: string[]): Promise<void> {
  return resolveProvider().selectSeats(offerId, seatIds);
}

export async function bookAndTicket(input: TicketInput): Promise<TicketResult> {
  return resolveProvider().bookAndTicket(input);
}
