export const TASK052_TARGET_HOTEL_ID = "hotel-paris-1";
export const TASK052_TARGET_HOTEL_NAME = "Le Meurice";
export const TASK052_TARGET_ROOM = "Deluxe Suite";

export interface CheckoutSelection {
  hotelId?: string | null;
  hotelName?: string | null;
  room?: string | null;
}

export function isTask052TargetSelection(
  hotelId: string | null | undefined,
  room: string | null | undefined
): boolean {
  return hotelId === TASK052_TARGET_HOTEL_ID && room === TASK052_TARGET_ROOM;
}

export function shouldUseTask052CheckoutFlow({
  hotelId,
  hotelName,
  room,
}: CheckoutSelection): boolean {
  const hasExplicitSelection = Boolean(hotelId || hotelName || room);
  return !hasExplicitSelection || isTask052TargetSelection(hotelId, room);
}
