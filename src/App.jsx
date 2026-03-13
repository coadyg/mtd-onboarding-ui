import { useState, useEffect } from "react"
import "./App.css"

function App() {

  const [contacts, setContacts] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(null)

  function selectContact(contact) {

    console.log("Selected contact:", contact)

    setQuery(contact.name)
    setContacts([])

  }

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
    <div style={{
      paddingTop: "120px",
      fontFamily: "Arial",
      textAlign: "center"
    }}>

      <h1>MTD Onboarding Tool</h1>

      <div style={{
        width: "320px",
        margin: "0 auto",
        position: "relative"
      }}>

        <input
          type="text"
          placeholder="Search client..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        {(contacts.length > 0 || loading) && (

          <div style={{
            position: "absolute",
            top: "42px",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            textAlign: "left",
            zIndex: 10
          }}>

            {loading && (
              <div style={{ padding: "10px", color: "#777" }}>
                Searching...
              </div>
            )}

            {!loading && contacts.map((c, i) => (

              <div
                key={i}
                onClick={() => selectContact(c)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  backgroundColor: hoverIndex === i ? "#f5f7fa" : "white"
                }}
              >

                <div style={{ fontWeight: "500" }}>
                  {c.name}
                </div>

                <div style={{
                  fontSize: "12px",
                  color: "#666"
                }}>
                  {c.email}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}

export default App
