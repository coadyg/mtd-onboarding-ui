import { useState, useEffect } from "react"
import "./App.css"

function App() {

  const [contacts, setContacts] = useState([])
  const [query, setQuery] = useState("")

  useEffect(() => {

    if (!query) {
      setContacts([])
      return
    }

    const timeout = setTimeout(async () => {

      const response = await fetch(
        "https://mtd-onboarding-20104860254.development.catalystserverless.eu/server/getContacts_2/execute?q=" +
        encodeURIComponent(query)
      )

      const data = await response.json()

      setContacts(data)

    }, 300)

    return () => clearTimeout(timeout)

  }, [query])

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      <h1>MTD Onboarding Tool</h1>

      <input
        type="text"
        placeholder="Search client..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginRight: "10px", padding: "6px", width: "240px" }}
      />

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
