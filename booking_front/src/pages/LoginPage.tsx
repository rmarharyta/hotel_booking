import React from "react";
import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import WelcomeText from "../components/WelcomeText";
import UserName from "../components/UserName";
import Password from "../components/Password";
import useAuth from "../utils/Contexts/useAuth";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const auth = useAuth();

  const isValidPassword = (password: string) => password.length >= 6;

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isButtonDisabled =
    !isValidEmail(username) || !isValidPassword(password);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => auth.signin(username, password),
    onSuccess: () => navigate("*"),
    onError: (err: any) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!isButtonDisabled) mutate();
  };

  return (
    <Box
      width={1}
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#c8dfea",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "90vw",
          maxWidth: "700px",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderRadius: isMobile ? "30px" : "60px",
          padding: isMobile ? "20px" : "40px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            alignItems: "center",
            rowGap: isMobile ? 1.5 : 2,
          }}
        >
          <WelcomeText />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              rowGap: isMobile ? 1.5 : 2,
            }}
          >
            <UserName
              value={username}
              onChange={setUsername}
              isSubmitted={isSubmitted}
            />
            <Password
              value={password}
              onChange={setPassword}
              isSubmitted={isSubmitted}
            />
          </Box>

          {/* Логін кнопка */}
          <CustomButton
            text={isPending ? "Waiting..." : "Log in"}
            color="#08031B"
            disabled={isButtonDisabled}
            onClick={() => {
              setIsSubmitted(true);
              if (!isButtonDisabled) mutate();
            }}
          />
          {/* Сігнап кнопка */}
          <CustomButton
            text="Sign Up"
            color="#4b0082"
            onClick={() => navigate("/signup")}
          />

          {error && (
            <Box sx={{ color: "red", mt: 1, textAlign: "center" }}>{error}</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
