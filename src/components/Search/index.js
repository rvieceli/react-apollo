import React, { useState } from "react";
import { withApollo } from "react-apollo";
import Link from "../Link";

import { FEED_SEARCH_QUERY } from "./graphql";

function Search({ client }) {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState("");

  async function handleSearch() {
    if (!filter) return;

    const { data } = await client.query({
      query: FEED_SEARCH_QUERY,
      variables: {
        filter
      }
    });

    setLinks(data.feed.links);
  }

  return (
    <div className="flex flex-column mt3">
      <div>
        Search
        <input type="text" onChange={event => setFilter(event.target.value)} />
        <button type="button" onClick={() => handleSearch()}>
          OK
        </button>
      </div>

      {links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </div>
  );
}

export default withApollo(Search);
