import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@store";
import { Routes } from "@types";
import styles from "./index.module.css";
import { Button, Div, Text, TextInput } from "@components";

const Login = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmit = () => {
    setLoading(true);
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: username,
      createdAt: new Date(),
      settings: {
        notifications: true,
        darkMode: false,
        language: "en",
      },
    });
    navigate(`/${Routes.home}`);
    setLoading(false);
  };

  return (
    <Div className={styles.container}>
      <Div className={styles.contentWrapper}>
        <Div className={styles.headerSection}>
          <Div className={styles.logoContainer}>
            <Div className={styles.logoWrapper}>
              <img
                src={require("@assets/images/icons/logo.png")}
                className={styles.logo}
                alt="logo"
              />
            </Div>
            <Div className={styles.brandContainer}>
              <Div className={styles.brandWrapper}>
                <Text as="h1" className={styles.brandName}>aura</Text>
                <Text as="span" className={styles.brandPhonetic}>/ˈɔːrə/</Text>
              </Div>
            </Div>
          </Div>
          <Div className={styles.welcomeText}>
            <Text as="h2" className={styles.greeting}>
              Hi, <Text as="span" className={styles.username}>{username}</Text>
            </Text>
          </Div>
          <Div className={styles.subText}>
            <Text>Let's get started by setting up your account</Text>
          </Div>
        </Div>

        <Div className={styles.inputSection}>
          <TextInput
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name here..."
            className={styles.input}
          />
        </Div>

        <Div className={styles.buttonSection}>
          <Button
            loading={loading}
            disabled={!username}
            title="Continue"
            onClick={onSubmit}
          />
        </Div>
      </Div>
    </Div>
  );
};

export default Login;
