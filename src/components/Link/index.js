import React, { useMemo } from "react";
import { parseISO, formatDistanceToNow } from "date-fns";
import { useMutation } from "react-apollo";

import { AUTH_TOKEN } from "../../constants";
import { VOTE_MUTATION } from "./graphql";

export default function Link({ link, index }) {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const createdAt = useMemo(
    () =>
      formatDistanceToNow(parseISO(link.createdAt), {
        addSuffix: true
      }),
    [link]
  );

  const [voteMutation] = useMutation(VOTE_MUTATION);

  async function handleVote() {
    try {
      await voteMutation({ variables: { linkId: link.id } });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <div className="ml1 gray f11" onClick={handleVote}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by{" "}
          {link.postedBy ? link.postedBy.name : "Unknown"} {createdAt}
        </div>
      </div>
    </div>
  );
}
