import * as prismic from "@prismicio/client";

export const repositoryName = "ignews156";
const endpoint = prismic.getEndpoint(repositoryName);

export function getPrismicClient(req?: unknown) {
  const prismicClient = prismic.createClient(endpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    routes: [
      {
        type: "post",
        path: "/post/:uid",
      },
    ],
  });

  return prismicClient;
}
