import { useEffect } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "ryan_c_harris";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const checkForWallet = async () => {
    try {
      const { solana } = window;

      if (solana.isPhantom) console.log("Phantom connected!");
      else console.log("Solana not found!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.addEventListener("load", async (event) => {
      await checkForWallet();
    });
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
