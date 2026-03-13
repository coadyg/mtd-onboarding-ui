import { useState, useEffect } from "react"
import "./App.css"

function App() {

  const [contacts, setContacts] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (!query) {
      setContacts([])
      return
    }

    const timeout = setTimeout(async () => {

      try {

        setLoading(true)

        const response = await fetch(
          "https://mtd-onboarding-20104860254.development.catalystserverless.eu/server/getContacts_2/execute?q=" +
          encodeURIComponent(query)
        )

        const data = await response.json()

        setContacts(data)

      } catch (err) {

        console.error("Search error:", err)
        setContacts([])

      } finally {

        setLoading(false)

      }

    }, 300)

    return () => clearTimeout(timeout)

  }, [query])

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", textAlign: "center" }}>

      <h1>MTD Onboarding Tool</h1>

      <input
        type="text"
        placeholder="Search client..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          marginTop: "10px",
          padding: "8px",
          width: "250px",
          fontSize: "14px"
        }}
      />

      <div style={{ marginTop: "30px" }}>

        {loading && (
          <div style={{ color: "#777" }}>
            Searching...
          </div>
        )}

        {!loading && contacts.length === 0 && query && (
          <div style={{ color: "#777" }}>
            No results
          </div>
        )}

        {contacts.map((c, i) => (
          <div key={i} style={{ marginTop: "6px" }}>
            {c.name} — {c.email}
          </div>
        ))}

      </div>

    </div>
  )
}

export default App
