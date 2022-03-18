import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const posts = {
  title: "Post 1",
  content: "<p>Post 1 excerpt</p>",
  updatedAt: "2020-01-01",
  slug: "post-1",
};

jest.mock("../../services/prismic");
jest.mock("next-auth/react");

describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={posts} />);

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 1 excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockReturnValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: "post-1" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockReturnValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        last_publication_date: "2020-01-01",
        data: {
          title: [
            {
              type: "heading",
              text: "Post 1",
              spans: [],
            },
          ],
          content: [
            {
              type: "paragraph",
              text: "Post 1 excerpt",
              spans: [],
            },
          ],
        },
      }),
    } as any);

    const response = await getServerSideProps({
      params: { slug: "post-1" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "post-1",
            title: "Post 1",
            content: "<p>Post 1 excerpt</p>",
            updatedAt: "01 de janeiro de 2020",
          },
        },
      })
    );
  });
});
