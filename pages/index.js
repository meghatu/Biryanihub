import Head from "next/head";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Menu from "../components/Menu";
import css from "../styles/Home.module.css";
import { client } from "../lib/client";
import Login from "../pages/user/login"

import { useEffect, useState } from "react";


export default function Home({biryanis}) {
  const [isLoggedIn, setisLoggedIn] = useState('')
  useEffect(() => {
    setisLoggedIn(JSON.parse(localStorage.getItem('isAuth')))
    const item = JSON.parse(localStorage.getItem('isAuth'))
    console.log(item)
  }, [isLoggedIn])

  return isLoggedIn === "YES" ? 
    <Layout>
      <div className={css.container}>
        <Head>
          <title>BiryaniHub</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/Logo.png" />
        </Head>
        {/* body */}
        <main>
          <Hero/>
          <Services/>
          <Menu biryanis={biryanis}/>
        </main>
      </div>
    </Layout> : <Login/>
  ;
}


export const getServerSideProps = async()=> {
  const query = '*[_type == "biryani"]';
  const biryanis = await client.fetch(query);
  return {
    props: {
      biryanis
    }
  }
}



