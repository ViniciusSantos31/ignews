import { render, screen } from "@testing-library/react";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripes";

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return {
        data: null,
        status: "loading",
      };
    },
  };
});

jest.mock("next/router");

jest.mock("../../services/stripes");

describe("Home page", () => {
  it("renders correctly", () => {
    render(
      <Home product={{ amount: "fake-amount", priceId: "fake-priceID" }} />
    );

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockReturnValueOnce({
      id: "fake-priceID",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-priceID",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
