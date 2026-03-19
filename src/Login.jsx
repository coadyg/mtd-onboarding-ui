import { useEffect } from "react"

function Login() {

  useEffect(() => {
    if (window.catalyst) {
      window.catalyst.auth.signIn("catalyst-login-container")
    }
  }, [])

  return <div id="catalyst-login-container"></div>

}

export default Login
