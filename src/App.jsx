import { useState } from "react"
import "./App.css"

function App() {

  const [contacts, setContacts] = useState([])
  const [query, setQuery] = useState("")

  async function searchContacts() {

    const response = await fetch(
      "https://mtd-onboarding-20104860254.development.catalystserverless.eu/server/getContacts_2/execute?q=" + query
    )

    const data = await response.json()

    setContacts(data)

  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      <h1>MTD Onboarding Tool</h1>

      <input
        type="text"
        placeholder="Search client..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <button onClick={searchContacts}>
        Search
      </button>

      <div style={{ marginTop: "30px" }}>
        {contacts.map((c, i) => (
          <div key={i}>
            {c.name} — {c.email}
          </div>
        ))}
      </div>

    </div>
  )
}

export default App
