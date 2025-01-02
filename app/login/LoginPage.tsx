import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  return passwordRegex.test(password);
};

const LoginPage = () => {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validEmail = "admin@gmail.com";
  const validPassword = "4dm1n0K*";

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          router.replace("/task");
        } else {
          setShowLogin(true);
        }
      } catch (error) {
        console.log("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const login = useCallback(async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Error",
        "Password must include at least one uppercase letter, one number, and one special character."
      );
      return;
    }

    if (
      email.toLocaleLowerCase() === validEmail.toLocaleLowerCase() &&
      password === validPassword
    ) {
      try {
        await AsyncStorage.setItem("user", JSON.stringify({ email, password }));
        Alert.alert("Success", "You are logged in!", [
          {
            text: "OK",
            onPress: () => {
              setEmail("");
              setPassword("");
              router.replace("/task");
            },
          },
        ]);
      } catch (error) {
        Alert.alert("Error", "Failed to save user data.");
      }
    } else {
      Alert.alert("Error", "Invalid email or password.");
    }
  }, [email, password]);

  if (!showLogin) {
    return null;
  }

  return (
    <LinearGradient colors={["#56c584", "#4f80c6"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="account" size={24} color="#4f80c6" />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock" size={24} color="#4f80c6" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text
            style={styles.registerText}
            onPress={() => Alert.alert("Redirect to Register")}
          >
            Register here
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: 55,
    marginBottom: 20,
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    width: "100%",
    height: 50,
    fontSize: 16,
    paddingLeft: 10,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4f80c6",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 25,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  registerText: {
    color: "#4f80c6",
    fontWeight: "bold",
  },
});

export default LoginPage;
