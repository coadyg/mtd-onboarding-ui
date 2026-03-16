import { useState, useEffect } from "react"
import "./App.css"

function App() {

  const [contactIndex, setContactIndex] = useState([])
  const [results, setResults] = useState([])
  const [query, setQuery] = useState("")
  const [hoverIndex, setHoverIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  function selectContact(contact) {

    console.log("Selected contact:", contact)

    const name = contact.search.split("|")[0].trim()

    setQuery(name)
    setResults([])
    setHoverIndex(null)

  }

  function handleKeyDown(e) {

    if (results.length === 0) return

    if (e.key === "ArrowDown") {

      e.preventDefault()

      setHoverIndex(prev =>
        prev === null || prev === results.length - 1 ? 0 : prev + 1
      )

    }

    if (e.key === "ArrowUp") {

      e.preventDefault()

      setHoverIndex(prev =>
        prev === null || prev === 0 ? results.length - 1 : prev - 1
      )

    }

    if (e.key === "Enter" && hoverIndex !== null) {

      selectContact(results[hoverIndex])

    }

  }

  // load contact index once

  useEffect(() => {

    async function loadIndex() {

      try {

        const response = await fetch(
          "https://mtd-onboarding-20104860254.development.catalystserverless.eu/server/getContactIndex/execute"
        )

        const data = await response.json()

        const normalised = data.map(c => ({
          ...c,
          search: c.search.toLowerCase()
        }))

        setContactIndex(normalised)

      } catch (err) {

        console.error("Failed to load contact index:", err)

      } finally {

        setLoading(false)

      }

    }

    loadIndex()

  }, [])

  // local search

  useEffect(() => {

    if (!query) {
      setResults([])
      return
    }

    const q = query.toLowerCase()

    const filtered = contactIndex
      .filter(c => c.search.includes(q))
      .slice(0, 10)

    setResults(filtered)

  }, [query, contactIndex])

  return (
    <div style={{
      paddingTop: "120px",
      fontFamily: "Arial",
      textAlign: "center"
    }}>

      <h1>MTD Onboarding Tool</h1>

      {loading && (
        <div>Loading contacts...</div>
      )}

      {!loading && (

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
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          {(results.length > 0) && (

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

              {results.map((c, i) => {

                const parts = c.search.split("|")
                const name = parts[0].trim()
                const details = parts.slice(1).join("|").trim()

                return (

                  <div
                    key={c.id}
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
                      {name}
                    </div>

                    <div style={{
                      fontSize: "12px",
                      color: "#666"
                    }}>
                      {details}
                    </div>

                  </div>

                )

              })}

            </div>

          )}

        </div>

      )}

    </div>
  )
}

export default App
