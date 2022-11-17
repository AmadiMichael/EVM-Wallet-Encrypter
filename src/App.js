import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import { Loader, Center } from "@mantine/core";

function App() {
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

  async function encryptNew(event) {
    event.preventDefault();
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

  return (
    <div className="App">
      <header>
        <h1>WALLET ENCRYPTER</h1>
        <div className="line" />
      </header>
      <p
        style={{
          marginBottom: "4em",
        }}
      />
      <h4> GENERATE A NEW WALLET AND ENCRYPT IT</h4>
      <p />
      <h6
        style={{
          color: "grey",
        }}
      >
        {" "}
        Info: Create a new wallet and encrypt it with a password of your choice{" "}
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
        <button type="submit"> ENCRYPT </button>
      </form>{" "}
      <p
        style={{
          marginBottom: "3em",
        }}
      />
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
        <button type="submit"> ENCRYPT </button>
      </form>
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
