import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps, Post } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

const posts: Post[] = [
  {
    title: "Post 1",
    excerpt: "Post 1 excerpt",
    updatedAt: "2020-01-01",
    slug: "post-1",
  },
];

jest.mock("../../services/prismic");

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("Post 1")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByType: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "post-1",
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
            last_publication_date: "2020-01-01",
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "post-1",
              title: "Post 1",
              excerpt: "Post 1 excerpt",
              updatedAt: "01 de janeiro de 2020",
            },
          ],
        },
      })
    );
  });
});
