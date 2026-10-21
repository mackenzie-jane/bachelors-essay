import Constants from "expo-constants";

// In development, Expo knows the address of the computer running it
// (something like "10.0.0.159:8081"), so we reuse that IP for Flask.
const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];

// Fallback if the host can't be detected; edit if you ever need it
const FALLBACK_HOST = "10.0.0.159";

export const API_URL = `http://${expoHost ?? FALLBACK_HOST}:5001`;
