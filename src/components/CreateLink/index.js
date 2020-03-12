import React, { useState } from "react";
import { useMutation } from "react-apollo";

import { FEED_QUERY } from "../LinkList/graphql";
import { LINKS_PER_PAGE } from "../../constants";
import { POST_MUTATION } from "./graphql";

export default function CreateLink({ history }) {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [post, { loading }] = useMutation(POST_MUTATION, {
    onCompleted: () => history.push("/new/1"),
    update: (store, { data: { post } }) => {
      const first = LINKS_PER_PAGE;
      const skip = 0;
      const orderBy = "createdAt_DESC";

      const data = store.readQuery({
        query: FEED_QUERY,
        variables: { first, skip, orderBy }
      });
      data.feed.links.unshift(post);

      store.writeQuery({
        query: FEED_QUERY,
        data,
        variables: { first, skip, orderBy }
      });
    }
  });

  async function handleSubmit() {
    try {
      await post({ variables: { description, url } });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          type="text"
          className="mb2"
          value={description}
          onChange={event => setDescription(event.target.value)}
          placeholder="A description for the link"
        />
        <input
          type="text"
          className="mb2"
          value={url}
          onChange={event => setUrl(event.target.value)}
          placeholder="The url for the link"
        />
      </div>
      <button type="button" onClick={handleSubmit}>
        {loading ? "Creating" : "Submit"}
      </button>
    </div>
  );
}
