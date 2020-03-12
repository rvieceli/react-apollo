import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { AUTH_TOKEN } from "../../constants";

import { LOGIN_MUTATION, SIGNUP_MUTATION } from "./graphql";

export default function Login({ history }) {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [mutation, { loading }] = useMutation(
    login ? LOGIN_MUTATION : SIGNUP_MUTATION,
    {
      onCompleted: data => onCompleted(data)
    }
  );

  async function handleSubmit() {
    try {
      await mutation({
        variables: {
          email,
          password,
          name
        }
      });
    } catch (err) {
      alert(err);
    }
  }

  function onCompleted(data) {
    const { token } = login ? data.login : data.signup;
    localStorage.setItem(AUTH_TOKEN, token);

    history.push("/");
  }

  return (
    <div>
      <h4 className="mv3">{login ? "Login" : "Sign up"}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Your name"
          />
        )}
        <input
          type="text"
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="Your email address"
        />
        <input
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <div className="pointer mr2 button" onClick={() => handleSubmit()}>
          {login ? "login" : "create account"} {loading && "..."}
        </div>
        <div className="pointer but" onClick={() => setLogin(!login)}>
          {login ? "need to create an account" : "already have an account"}
        </div>
      </div>
    </div>
  );
}
