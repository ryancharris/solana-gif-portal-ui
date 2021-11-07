import { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "ryan_c_harris";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp",
  "https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g",
  "https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g",
  "https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp",
];

const App = () => {
  const [address, setAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const checkForWallet = async () => {
    try {
      const { solana } = window;

      if (solana.isPhantom) {
        console.log("Phantom present!");

        const res = await solana.connect({ onlyIfTrusted: true });
        console.log("Connected with Public Key:", res.publicKey.toString());
        setAddress(res.publicKey.toString());
      } else {
        console.log("Solana not found!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const res = await solana.connect();
      console.log(`Connected wallet with key: ${res.publicKey.toString()}`);
      setAddress(res.publicKey.toString());
    }
  };

  const renderUnconnectedContainer = () => {
    return (
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWallet}
      >
        Connect to Wallet
      </button>
    );
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
    } else {
      console.log("Empty input. Try again.");
    }
  };

  const renderConnectedContainer = () => {
    const gifs = gifList.map((gif) => {
      return (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      );
    });
    return (
      <div className="connected-container">
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="cta-button submit-gif-button" onClick={sendGif}>
          Submit
        </button>
        <div className="gif-grid">{gifs}</div>
      </div>
    );
  };

  useEffect(() => {
    window.addEventListener("load", async (event) => {
      await checkForWallet();
    });
  }, []);

  useEffect(() => {
    if (address) {
      console.log("Fetching GIF list...");
      setGifList(TEST_GIFS);
    }
  }, [address]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!address && renderUnconnectedContainer()}
          {address && (
            <>
              <p className="text">address: {address}</p>
              {renderConnectedContainer()}
            </>
          )}
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
