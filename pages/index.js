import Particles from "./Particle";
import { useEffect, useState } from "react";
import Head from "next/head";
import { gsap } from "gsap";

export default function Home() {
  const [counter, setCounter] = useState({ users: 10467894 });
  const [users, setUsers] = useState();

  const handleCounter = () => {
    const value = counter.users;
    const formattedNo = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setUsers(formattedNo);
  };
  useEffect(() => {
    handleCounter();
    const tl = gsap.timeline({ defaults: { ease: "power1.out" } });
    tl.to(".text", { y: "0%", duration: 1, stagger: 0.25 });
    tl.to(".slider", { y: "-100%", duration: 1.5, delay: 0.5 });
    tl.to(".intro", { y: "-100%", duration: 1 }, "-=1");
    tl.fromTo(".container", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=1");
    tl.fromTo(".buttons", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=1");
  }, []);
  return (
    <div>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hanalei&Alfa+Slab+One&family=Potta+One&family=Sacramento&display=swap"
          rel="stylesheet"
        />
        <title>#1 trusted empowerment website</title>
      </Head>
      <Particles />
      <div>
        <main className="landing">
          <div className="container">
            <div>
              <h2 className="join">
                Join the {counter ? <p className="">{users}</p> : null}{" "}
                registered users on
              </h2>
            </div>
            <h2 className="big-text">Coding Class 2020 🌍</h2>

            <div className="button-container">
              <button className="buttons">
                <span className="span"> Login/Signup Now</span>
              </button>
              <button className="buttons">
                <span className="span"> Learn More...</span>
              </button>
            </div>
          </div>
        </main>
        <div className="intro">
          <div className="intro-text">
            <h1 className="hide">
              <span className="text">🇳🇬 Innovative empowerment</span>
            </h1>
            <h1 className="hide">
              <span className="text">for Africans</span>
            </h1>
            <h1 className="hide">
              <span className="text">all over the world.🇳</span>
            </h1>
          </div>
        </div>
        <div className="slider"></div>
      </div>
    </div>
  );
}
