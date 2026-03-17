import { useParams } from "react-router-dom"

function Onboarding() {

  const { sessionId } = useParams()

  return (

    <div style={{
      padding: "60px",
      fontFamily: "Arial"
    }}>

      <h1>MTD Onboarding</h1>

      <p>
        Session: <b>{sessionId}</b>
      </p>

      <p>
        This is the onboarding workflow page.
      </p>

    </div>

  )

}

export default Onboarding