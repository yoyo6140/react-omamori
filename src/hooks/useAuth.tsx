import axios from "axios";
const LOGIN_URL = "/admin/signin";
const LOGOUT_URL = "/logout";
const CHECK_LOGIN_URL = "/api/user/check";

//登入輸入
interface LoginInput {
  username: string;
  password: string;
}
export type LoginFailResponse = {
  success: false;
  message: string;
  error: {
    code: string;
    message: string;
  };
};
//登入成功回應
export type LoginSuccessResponse = {
  success: true;
  message: string;
  uid: string;
  token: string;
  expired: number;
};

export const Login = async (input: LoginInput): Promise<LoginSuccessResponse> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const res = await axios.post<LoginSuccessResponse>(`${baseURL}/v2${LOGIN_URL}`, input);
    return res.data;
  } catch (err) {
    throw err;
  }
};
