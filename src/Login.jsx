import { useEffect } from "react"

function Login() {

  useEffect(() => {

    if (window.catalyst) {

      window.catalyst.auth.signIn("catalyst-login-container")

    }

  }, [])

  return (
    <div style={{ paddingTop: "120px", textAlign: "center" }}>
      <div id="catalyst-login-container"></div>
    </div>
  )

}

export default Login
