import Head from "next/head";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Menu from "../components/Menu";
import css from "../styles/Home.module.css";
import { client } from "../lib/client";
import { useState, useEffect } from "react";
import {UilSignout} from "@iconscout/react-unicons";


const SESSION_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function Home({ biryanis }) {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedExpirationTime = localStorage.getItem("expirationTime");

    if (storedUsername && storedExpirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime < storedExpirationTime) {
        setUsername(storedUsername);
        setisLoggedIn(true);
        setExpirationTimer(storedExpirationTime - currentTime);
      } else {
        logout();
      }
    }
  }, []);

  const setExpirationTimer = (expirationTime) => {
    setTimeout(logout, expirationTime);
  };

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      const expirationTime = new Date().getTime() + SESSION_EXPIRATION_TIME;
      localStorage.setItem("username", username);
      localStorage.setItem("expirationTime", expirationTime);
      setExpirationTimer(SESSION_EXPIRATION_TIME);
      setisLoggedIn(true);
    } else {
      alert("Invalid username or password");
    }
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("expirationTime");
    setisLoggedIn(false);
  };

  return isLoggedIn ? (
    <Layout>
      <div className={css.containeer}>
        <Head>
          <title>BiryaniHub</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/Logo.png" />
        </Head>
        {/* body */}
        <main>
          <button className={css.logoutButton} onClick={logout}>
          <UilSignout size={28}/>
          </button>
          <Hero />
          <Services />
          <Menu biryanis={biryanis} />
        </main>
      </div>
    </Layout>
  ) : (
    <div className={css.container}>
      <div className={css.wrapper}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          className={css.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          className={css.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button className={css.button} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = '*[_type == "biryani"]';
  const biryanis = await client.fetch(query);
  return {
    props: {
      biryanis,
    },
  };
};
