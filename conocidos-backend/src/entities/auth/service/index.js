import UserModel from "../../user/model";

const AuthService = () => ({
  async signIn(token) {
    const credentials = decodeBase64Token(token);
    if (!credentials || !credentials.username || !credentials.password) {
      return res.status(400).json({ error: "Token inválido" });
    }

    const { username, password } = credentials;

    const users = await UserModel.get({ username, password });

    if (users.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
  },

  deleteUser(userProviderId) {
    return ManagementClient.deleteUser({ id: userProviderId });
  },
});

const decodeBase64Token = (token) => {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [username, password] = decoded.split(":");
    return { username, password };
  } catch (err) {
    return null;
  }
};

export default AuthService;
