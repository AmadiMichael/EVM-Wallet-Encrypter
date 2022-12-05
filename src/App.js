import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import { Loader, Center } from "@mantine/core";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
function App() {
  const r = document.querySelector(":root");
  const [currentWalletInfo, setCurrentWalletInfo] = useState({
    walletAddress: "",
    publicKey: "",
    privateKey: "",
    mnemonicPhrase: {},
    encryptedWallet: {},
  });
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [encryptionProgress, setEncryptionProgress] = useState(null);

  async function encrypter(walletInstance, password) {
    try {
      function callback(progress) {
        setEncryptionProgress(
          "Encrypting: " + parseInt(progress * 100) + "% complete"
        );
      }

      const encryptedWallet = await walletInstance.encrypt(password, callback);

      setCurrentWalletInfo({
        walletAddress: walletInstance.address,
        publicKey: walletInstance.publicKey,
        privateKey: walletInstance.privateKey,
        mnemonicPhrase: walletInstance.mnemonic ?? { phrase: "" },
        encryptedWallet: encryptedWallet,
      });
    } catch (err) {
      setIsEncrypting(false);
      setErrorMessage(err.message);
    }
  }

  async function isOnline() {
    console.log(window.navigator.onLine);
    return window.navigator.onLine;
  }

  async function encryptNew(event) {
    event.preventDefault();

    if (await isOnline()) {
      NotificationManager.error(
        "For full security, kindly turn off all internet connection"
      );
      return;
    }
    if (isEncrypting) {
      NotificationManager.warning(
        `Currently encrypting a wallet.\nPlease wait`
      );
      return;
    }

    setErrorMessage(null);
    setCurrentWalletInfo({
      walletAddress: "",
      publicKey: "",
      privateKey: "",
      mnemonicPhrase: {},
      encryptedWallet: {},
    });
    setIsEncrypting(true);

    let wallet;
    try {
      wallet = ethers.Wallet.createRandom();
      await encrypter(wallet, event.target.pass.value);
    } catch (err) {
      setErrorMessage(err.message);
    }

    setIsEncrypting(false);
  }

  async function encryptPK(event) {
    event.preventDefault();
    if (await isOnline()) {
      NotificationManager.error(
        "For full security, kindly turn off all internet connection"
      );
      return;
    }
    if (isEncrypting) {
      NotificationManager.warning(
        `Currently encrypting a wallet.\nPlease wait`
      );
      return;
    }
    setErrorMessage(null);

    setCurrentWalletInfo({
      walletAddress: "",
      publicKey: "",
      privateKey: "",
      mnemonicPhrase: {},
      encryptedWallet: {},
    });
    setIsEncrypting(true);

    let wallet;

    try {
      wallet = new ethers.Wallet(event.target.pk.value);
      console.log(wallet);
      await encrypter(wallet, event.target.pass.value);
    } catch (err) {
      setErrorMessage(err.message);
    }

    setIsEncrypting(false);
  }

  async function encryptMnemonic(event) {
    event.preventDefault();
    if (await isOnline()) {
      NotificationManager.error(
        "For full security, kindly turn off all internet connection"
      );
      return;
    }
    if (isEncrypting) {
      NotificationManager.warning(
        `Currently encrypting a wallet.\nPlease wait`
      );
      return;
    }
    setErrorMessage(null);
    setCurrentWalletInfo({
      walletAddress: "",
      publicKey: "",
      privateKey: "",
      mnemonicPhrase: {},
      encryptedWallet: {},
    });

    setIsEncrypting(true);

    if (ethers.utils.isValidMnemonic(event.target.mnemonic.value, "en")) {
      let wallet;

      try {
        wallet = ethers.Wallet.fromMnemonic(event.target.mnemonic.value);
        await encrypter(wallet, event.target.pass.value);
      } catch (err) {
        setErrorMessage(err.message);
      }
    } else {
      setErrorMessage("Invalid mnemonic phrase");
    }

    setIsEncrypting(false);
  }

  function displays(val) {
    if (val === "nw") {
      r.style.setProperty("--nw", "block");
      r.style.setProperty("--pk", "none");
      r.style.setProperty("--mp", "none");
    } else if (val === "pk") {
      r.style.setProperty("--nw", "none");
      r.style.setProperty("--pk", "block");
      r.style.setProperty("--mp", "none");
    } else if (val === "mp") {
      r.style.setProperty("--nw", "none");
      r.style.setProperty("--pk", "none");
      r.style.setProperty("--mp", "block");
    }
  }

  return (
    <div className="App">
      <header>
        <h1>WALLET ENCRYPTER</h1>
        <NotificationContainer />
        <div className="line" />
      </header>

      <h3> ENCRYPT ANY EVM WALLET OFFLINE WITH A PASSWORD INTO A JSON FILE </h3>

      <p
        style={{
          marginBottom: "4em",
        }}
      />
      <ul id="ul-nb" style={{ display: "flex", justifyContent: "center" }}>
        <li
          onClick={() => {
            displays("nw");
          }}
        >
          <div>Create New Wallet and Encrypt</div>
        </li>
        <li
          onClick={() => {
            displays("pk");
          }}
        >
          <div>Encrypt a wallet via Private keys</div>
        </li>
        <li
          onClick={() => {
            displays("mp");
          }}
        >
          <div>Encrypt a wallet via Mnemonic phrase</div>
        </li>
      </ul>
      <p
        style={{
          marginBottom: "6.3em",
        }}
      />

      <div className="nw">
        <h4> GENERATE A NEW WALLET AND ENCRYPT IT</h4>
        <p />
        <h6
          style={{
            color: "grey",
          }}
        >
          {" "}
          Info: Create a new wallet and encrypt it with a password of your
          choice{" "}
        </h6>
        <form onSubmit={encryptNew}>
          <input id="pass" placeholder="Password" required /> <p />
          <button type="submit"> ENCRYPT </button>
        </form>
        <p
          style={{
            marginBottom: "3em",
          }}
        />
      </div>

      <div className="pk">
        <h4>
          {" "}
          ENCRYPT A WALLET VIA PRIVATE KEY <p />{" "}
        </h4>
        <h6
          style={{
            color: "grey",
          }}
        >
          {" "}
          Info: Encrypt your private key with a password of your choice. <br />{" "}
          (Wallets generated using a private key do not have a mnemonic phrase)
        </h6>
        <form onSubmit={encryptPK}>
          <input id="pk" placeholder="Private Key" required /> <p />
          <input id="pass" placeholder="Password" required /> <p />
          <button type="submit" disabled={isEncrypting}>
            {" "}
            ENCRYPT{" "}
          </button>
        </form>{" "}
        <p
          style={{
            marginBottom: "3em",
          }}
        />
      </div>

      <div className="mp">
        <h4> ENCRYPT A WALLET VIA MNEMONIC PHRASE </h4>
        <h6
          style={{
            color: "grey",
          }}
        >
          {" "}
          Info: Encrypt your Mnemonic phrase with a password of your choice{" "}
        </h6>
        <form onSubmit={encryptMnemonic}>
          <input id="mnemonic" placeholder="Mnemonic phrase" required /> <p />
          <input id="pass" placeholder="Password" required /> <p />
          <button type="submit" disabled={isEncrypting}>
            {" "}
            ENCRYPT{" "}
          </button>
        </form>
      </div>

      {isEncrypting ? (
        <div
          className="box"
          style={{
            marginTop: "2em",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          <Center>
            <Loader mt={15} color="black" />
          </Center>

          <h3>{encryptionProgress} </h3>
        </div>
      ) : null}
      <p />
      {errorMessage ? (
        <div
          className="box"
          style={{
            marginTop: "2em",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          {errorMessage}
        </div>
      ) : null}
      <p />
      {currentWalletInfo.walletAddress !== "" ? (
        <div
          className="box"
          style={{
            padding: "3em",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          <h4> WALLET ADDRESS </h4> {currentWalletInfo.walletAddress}{" "}
          <p
            style={{
              marginBottom: "3em",
            }}
          />
          <h4> PUBLIC KEY </h4> {currentWalletInfo.publicKey}{" "}
          <p
            style={{
              marginBottom: "3em",
            }}
          />
          <h4> PRIVATE KEY </h4> {currentWalletInfo.privateKey}
          <p
            style={{
              marginBottom: "3em",
            }}
          />
          <h4>
            {" "}
            MNEMONIC PHRASE <p />{" "}
            <h6 style={{ color: "grey" }}>
              {" "}
              (Wallets generated using a private key do not have a mnemonic
              phrase){" "}
            </h6>{" "}
          </h4>
          {currentWalletInfo.mnemonicPhrase !== {}
            ? currentWalletInfo.mnemonicPhrase.phrase
            : null}{" "}
          <p
            style={{
              marginBottom: "3em",
            }}
          />
          <h4> ENCRYPTED WALLET </h4>
          {currentWalletInfo.encryptedWallet.toString()}
        </div>
      ) : null}
    </div>
  );
}

export default App;
