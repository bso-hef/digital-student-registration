import Axios from "axios";

const CancelToken = Axios.CancelToken;

// Using relative URLs (empty baseURL) makes API calls work with any port
// Since our API routes are on the same domain as the app (Next.js API Routes),
// the browser automatically uses the current origin (protocol + host + port)
// This avoids hardcoding ports in the built bundle and works seamlessly in Docker
const http = Axios.create({
  baseURL: "",
  withCredentials: true,
  cancelToken: CancelToken.source().token,
});

export { CancelToken };
export default http;
