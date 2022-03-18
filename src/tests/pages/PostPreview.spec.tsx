import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  title: "Post 1",
  content: "<p>Post 1 excerpt</p>",
  updatedAt: "2020-01-01",
  slug: "post-1",
};

jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic");

describe("PostPreview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "loading",
    });

    render(<PostPreview post={post} />);

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 1 excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscription",
        expires: "fake-expires",
      },
      status: "authenticated",
    });

    const pushMocked = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMocked).toHaveBeenCalledWith("/posts/post-1");
  });

  it("loads initial data", async () => {
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

    const response = await getStaticProps({
      params: { slug: "post-1" },
    });

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
