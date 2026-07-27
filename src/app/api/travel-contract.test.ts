import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET as getControl, PATCH as patchControl } from "./state/route";
import { GET as getSession, POST as signIn } from "./account/session/route";
import { GET as getListing, PUT as saveListing } from "./property-listing/route";
import { POST as markCheckoutVisited } from "./task052/checkout-visited/route";
import { POST as addCartItem } from "./cart/items/route";
import { POST as createBooking } from "./bookings/route";
import { POST as createDispute } from "./disputes/route";
import { PATCH as saveSearch } from "./search/route";
import { GET as getTravelWorkspace } from "./travel-workspace/route";

const jsonRequest = (url: string, body: unknown, method = "POST") =>
  new NextRequest(url, {
    method,
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });

describe("TravelHub feature contracts", () => {
  it("projects product bootstrap data without evaluator-only fields", async () => {
    const cookie = "travel-contract.workspace";
    await patchControl(jsonRequest(
      `http://localhost/api/state?cookie=${cookie}`,
      {
        data: {
          evaluator_marker: { keep: true },
          unrelated_internal: { secret: "not-for-browser" },
          preferences: { currency: "GBP" },
        },
      },
      "PATCH",
    ));

    const response = await getTravelWorkspace(
      new NextRequest(`http://localhost/api/travel-workspace?cookie=${cookie}`),
    );
    const body = await response.json();
    expect(body.workspace.preferences.currency).toBe("GBP");
    expect(body.workspace.evaluator_marker).toBeUndefined();
    expect(body.workspace.unrelated_internal).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain("not-for-browser");

    const control = await getControl(new NextRequest(`http://localhost/api/state?cookie=${cookie}`));
    expect((await control.json()).state.data.evaluator_marker).toEqual({ keep: true });
  });

  it("persists an account session and preserves unrelated state", async () => {
    const cookie = "travel-contract.a";
    await patchControl(jsonRequest(
      `http://localhost/api/state?cookie=${cookie}`,
      { data: { evaluator_marker: { keep: true } }, note: "fixture" },
      "PATCH",
    ));
    const response = await signIn(jsonRequest(
      `http://localhost/api/account/session?cookie=${cookie}`,
      { email: "ada@example.com", provider: "email" },
    ));
    expect(response.status).toBe(200);
    const state = await getControl(new NextRequest(`http://localhost/api/state?cookie=${cookie}`));
    const data = (await state.json()).state.data;
    expect(data.auth.email).toBe("ada@example.com");
    expect(data.evaluator_marker).toEqual({ keep: true });
  });

  it("rejects arbitrary and evaluator-only session fields and isolates cookies", async () => {
    expect((await signIn(jsonRequest(
      "http://localhost/api/account/session?cookie=travel-contract.b",
      { email: "ada@example.com", provider: "email", developer_tools_open: true },
    ))).status).toBe(422);
    const other = await getSession(new NextRequest("http://localhost/api/account/session?cookie=travel-contract.c"));
    expect((await other.json()).session.isAuthenticated).toBe(false);
    await patchControl(jsonRequest(
      "http://localhost/api/state?cookie=travel-contract.projected",
      { data: { auth: { isAuthenticated: true, email: "safe@example.com", developer_tools_open: true } } },
      "PATCH",
    ));
    const projected = await getSession(new NextRequest("http://localhost/api/account/session?cookie=travel-contract.projected"));
    expect(JSON.stringify(await projected.json())).not.toContain("developer_tools_open");
  });

  it("validates and saves a narrow property listing draft", async () => {
    const cookie = "travel-contract.d";
    const listing = {
      selectedType: "hotel",
      formData: { email: "host@example.com", propertyName: "Ada House", address: "1 Main St" },
      showWizard: true,
      currentStep: 2,
    };
    expect((await saveListing(jsonRequest(
      `http://localhost/api/property-listing?cookie=${cookie}`,
      listing,
      "PUT",
    ))).status).toBe(200);
    const read = await getListing(new NextRequest(`http://localhost/api/property-listing?cookie=${cookie}`));
    expect((await read.json()).listing).toEqual(listing);
    expect((await saveListing(jsonRequest(
      `http://localhost/api/property-listing?cookie=${cookie}`,
      { ...listing, currentStep: 9 },
      "PUT",
    ))).status).toBe(422);
    expect((await saveListing(jsonRequest(
      `http://localhost/api/property-listing?cookie=${cookie}`,
      { ...listing, formData: { ...listing.formData, evaluator_flag: true } },
      "PUT",
    ))).status).toBe(422);
  });

  it("rejects an illegal checkout transition", async () => {
    const response = await markCheckoutVisited(jsonRequest(
      "http://localhost/api/task052/checkout-visited?cookie=travel-contract.e",
      {},
    ));
    expect(response.status).toBe(409);
  });

  it("rejects arbitrary nested cart details", async () => {
    const response = await addCartItem(jsonRequest(
      "http://localhost/api/cart/items?cookie=travel-contract.f",
      { type: "hotel", name: "Room", price: 100, details: { developer_tools_open: true } },
    ));
    expect(response.status).toBe(422);
  });

  it("creates a booking with server-owned fields and preserves unrelated state", async () => {
    const cookie = "travel-contract.booking";
    await patchControl(jsonRequest(
      `http://localhost/api/state?cookie=${cookie}`,
      { data: { evaluator_marker: { keep: "booking" } } },
      "PATCH",
    ));
    const input = {
      type: "hotel",
      confirmationNumber: "BK-TEST-001",
      propertyName: "Ada Hotel",
      location: "London",
      checkIn: "2027-01-10",
      checkOut: "2027-01-12",
      totalPrice: 240,
      currency: "GBP",
      guestName: "Ada Lovelace",
      roomType: "Double",
      details: { adults: 1, children: 0, rooms: 1, paymentMethod: "card" },
    };
    const response = await createBooking(jsonRequest(
      `http://localhost/api/bookings?cookie=${cookie}`,
      input,
    ));
    expect(response.status).toBe(200);
    const created = (await response.json()).booking;
    expect(created.id).toMatch(/^BK[A-F0-9]{8}$/);
    expect(created.status).toBe("confirmed");
    expect(created.createdAt).toEqual(expect.any(String));

    const control = await getControl(new NextRequest(`http://localhost/api/state?cookie=${cookie}`));
    const data = (await control.json()).state.data;
    expect(data.bookings).toContainEqual(created);
    expect(data.evaluator_marker).toEqual({ keep: "booking" });

    expect((await createBooking(jsonRequest(
      `http://localhost/api/bookings?cookie=${cookie}`,
      { ...input, status: "confirmed" },
    ))).status).toBe(422);
    expect((await createBooking(jsonRequest(
      `http://localhost/api/bookings?cookie=${cookie}`,
      { ...input, details: { ...input.details, developer_tools_open: true } },
    ))).status).toBe(422);
  });

  it("submits a dispute with a strict domain schema", async () => {
    const cookie = "travel-contract.dispute";
    await patchControl(jsonRequest(
      `http://localhost/api/state?cookie=${cookie}`,
      { data: { evaluator_marker: { keep: "dispute" } } },
      "PATCH",
    ));
    const input = {
      userType: "guest",
      confirmationNumber: "BK-TEST-001",
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      topic: "Refunds",
      message: "Please review this charge.",
    };
    const response = await createDispute(jsonRequest(
      `http://localhost/api/disputes?cookie=${cookie}`,
      input,
    ));
    expect(response.status).toBe(200);
    const created = (await response.json()).dispute;
    expect(created.id).toMatch(/^DSP[A-F0-9]{8}$/);
    expect(created.status).toBe("submitted");
    expect(created.submittedAt).toEqual(expect.any(String));

    const control = await getControl(new NextRequest(`http://localhost/api/state?cookie=${cookie}`));
    const data = (await control.json()).state.data;
    expect(data.disputes).toContainEqual(created);
    expect(data.evaluator_marker).toEqual({ keep: "dispute" });

    expect((await createDispute(jsonRequest(
      `http://localhost/api/disputes?cookie=${cookie}`,
      { ...input, status: "resolved" },
    ))).status).toBe(422);
    expect((await createDispute(jsonRequest(
      `http://localhost/api/disputes?cookie=${cookie}`,
      { ...input, developer_tools_open: true },
    ))).status).toBe(422);
  });

  it("records a typed flight search and rejects internal fields", async () => {
    const cookie = "travel-contract.search";
    await patchControl(jsonRequest(
      `http://localhost/api/state?cookie=${cookie}`,
      { data: { evaluator_marker: { keep: "search" } } },
      "PATCH",
    ));
    const lastQuery = {
      type: "flights",
      origin: "London",
      originCode: "LHR",
      destination: "Paris",
      destCode: "CDG",
      departDate: "2027-04-01",
      returnDate: "2027-04-05",
      travelers: 2,
      cabinClass: "economy",
      tripType: "round-trip",
    };
    const response = await saveSearch(jsonRequest(
      `http://localhost/api/search?cookie=${cookie}`,
      { lastQuery, filters: { directOnly: true, maxPrice: 500 } },
      "PATCH",
    ));
    expect(response.status).toBe(200);
    const updated = (await response.json()).search;
    expect(updated.lastQuery).toMatchObject(lastQuery);
    expect(updated.lastQuery.timestamp).toEqual(expect.any(String));

    const control = await getControl(new NextRequest(`http://localhost/api/state?cookie=${cookie}`));
    const data = (await control.json()).state.data;
    expect(data.search.lastQuery).toEqual(updated.lastQuery);
    expect(data.evaluator_marker).toEqual({ keep: "search" });

    expect((await saveSearch(jsonRequest(
      `http://localhost/api/search?cookie=${cookie}`,
      { lastQuery: { ...lastQuery, timestamp: "client-owned" } },
      "PATCH",
    ))).status).toBe(422);
    expect((await saveSearch(jsonRequest(
      `http://localhost/api/search?cookie=${cookie}`,
      { filters: { developer_tools_open: true } },
      "PATCH",
    ))).status).toBe(422);
  });
});
