import { useCallback } from "react";
import { account, ID } from "../appwrite/client";
import { useAppContext } from "../context/AppContext";

export function useAuth() {
  const { setUser } = useAppContext();

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const user = await account.create(ID.unique(), email, password, name);
        console.log("User created:", user);
        
        await login(email, password); // Automatically log in after registration
        
        return user;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const session = await account.createEmailPasswordSession(
          email,
          password
        );
        console.log("Logged in:", session);

        await getCurrentUser(); // Fetch user info after login

        return session;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    try {
      const result = await account.deleteSession("current");
      setUser(null);
      return result;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }, [setUser]);

  const getCurrentUser = useCallback(async () => {
    try {
      const userInfo = await account.get();
      setUser({
        id: userInfo.$id,
        name: userInfo.name,
        email: userInfo.email,
      });
    } catch (error) {
      console.error("No user session:", error);
      setUser(null);
    }
  }, [setUser]);

  return { register, login, logout, getCurrentUser };
}

// export const updateUser = async (
//   name: string,
//   email: string,
//   password: string
// ) => {
//   try {
//     const user = await account.updateEmail(email, password);
//     if (name) {
//       await account.updateName(name);
//     }
//     return user;
//   } catch (error) {
//     console.error("Update user error:", error);
//     throw error;
//   }
// };
