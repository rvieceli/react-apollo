import React, { useMemo } from "react";
import { useQuery } from "react-apollo";
import { LINKS_PER_PAGE } from "../../constants";

import Link from "../Link";

import {
  FEED_QUERY,
  NEW_LINKS_SUBSCRIPTION,
  NEW_VOTES_SUBSCRIPTION
} from "./graphql";

export default function LinkList({ history, location, match }) {
  const isNewPage = useMemo(() => location.pathname.includes("new"), [
    location.pathname
  ]);
  const page = useMemo(() => parseInt(match.params.page, 10), [
    match.params.page
  ]);
  const skip = useMemo(() => (isNewPage ? (page - 1) * LINKS_PER_PAGE : 0), [
    isNewPage,
    page
  ]);

  const { loading, error, data, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: {
      skip,
      first: isNewPage ? LINKS_PER_PAGE : 100,
      orderBy: isNewPage ? "createdAt_DESC" : null
    }
  });

  const linksToRender = useMemo(() => {
    if (loading || error) return [];
    if (isNewPage) return data.feed.links;

    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);

    return rankedLinks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isNewPage, loading]);

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;

      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(link => link.id === newLink.id);

      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      });
    }
  });

  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  });

  function handlePreviousPage() {
    if (page > 1) {
      const previousPage = page - 1;
      history.push(`/new/${previousPage}`);
    }
  }

  function handleNextPage() {
    if (page < data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      history.push(`/new/${nextPage}`);
    }
  }

  return (
    <div>
      {loading && <p>Loading</p>}
      {error && <p>Error</p>}
      {data && (
        <>
          {linksToRender.map((link, index) => (
            <Link key={link.id} link={link} index={index + skip} />
          ))}

          {isNewPage && (
            <div className="flex ml4 mv3 gray">
              <div className="pointer mr2" onClick={handlePreviousPage}>
                Previous
              </div>
              <div className="pointer" onClick={handleNextPage}>
                Next
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
