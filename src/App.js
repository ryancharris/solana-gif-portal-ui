import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import idl from "./idl.json";
import kp from "./keypair.json";

import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
const { SystemProgram } = web3;

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);
const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = {
  preflightCommitment: "processed",
};

// Constants
const TWITTER_HANDLE = "ryan_c_harris";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

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

  const getProvider = () => {
    const conn = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      conn,
      window.solana,
      opts.preflightCommitment
    );

    return provider;
  };

  const getGifList = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log("Retrieved the account: ", account);
      setGifList(account.gifList);
    } catch (error) {
      console.log("Error in getGifList: ", error);
      setGifList(null);
    }
  };

  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log("Empty input. Try again.");
      return;
    } else {
      try {
        const provider = getProvider();
        const program = new Program(idl, programID, provider);

        await program.rpc.addGif(inputValue, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        });

        console.log("Successfully sent GIF!");
        await getGifList();
      } catch (error) {
        console.log("Error sending GIF: ", error);
      }
    }
  };

  const renderConnectedContainer = () => {
    if (gifList === null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createGifAccount}
          >
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    } else {
      const gifs = gifList.map((gif, index) => {
        return (
          <div className="gif-item" key={gif.index}>
            <img src={gif.gifLink} alt={`gif-${index}`} />
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
    }
  };

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping");
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccount.publicKey.toString()
      );
      await getGifList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("load", async (event) => {
      await checkForWallet();
    });
  }, []);

  useEffect(() => {
    if (address) {
      console.log("Fetching GIF list...");
      getGifList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <p className="text">
                address: {address.slice(0, 2)}...{address.slice(-4)}
              </p>
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
