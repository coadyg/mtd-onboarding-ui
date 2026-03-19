import { Routes, Route, useNavigate } from "react-router-dom"
import Onboarding from "./Onboarding"
import { useState, useEffect, useRef } from "react"
import "./App.css"

function App() {

  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [contactIndex, setContactIndex] = useState([])
  const [results, setResults] = useState([])
  const [query, setQuery] = useState("")
  const [hoverIndex, setHoverIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState(null)
  const [user, setUser] = useState(null)

  const searchRef = useRef(null)
  const [sessions, setSessions] = useState([])
  const navigate = useNavigate()

  const catalystRef = useRef(null)


useEffect(() => {

  const catalyst = window.catalyst.initialize()
  catalystRef.current = catalyst

  async function checkAuth() {

      try {

        const currentUser = await catalyst.auth.getCurrentUser()

        console.log("Logged in user:", currentUser)

        setUser(currentUser)

await loadIndex()
await loadSessions()

      } catch {

        catalyst.auth.signIn()

      }

    }

    checkAuth()

  }, [])

  async function loadIndex() {

    try {

      const fn = catalystRef.current.function.functionId("getContactIndex")

      const response = await fn.execute()

      const data = await response.json()

      const normalised = data.map(c => ({
        ...c,
        raw: c.search,
        search: c.search.toLowerCase()
      }))

      setContactIndex(normalised)

    } catch (err) {

      console.error("Failed to load contact index:", err)

    } finally {

      setLoading(false)

    }

  }

  async function loadSessions() {

    try {

      const fn = catalystRef.current.function.functionId("getOnboardingSessionsV2")

      const response = await fn.execute()

      const data = await response.json()

      setSessions(data)

    } catch (err) {

      console.error("Failed to load sessions:", err)

    } finally {

      setSessionsLoading(false)

    }

  }

  function selectContact(contact) {

    console.log("Selected contact:", contact)

    const name = contact.search.split("|")[0].trim()

    setQuery(name)
    setResults([])
    setHoverIndex(null)
    setSelectedContact(contact)

  }

  function clearSelection() {

    setSelectedContact(null)
    setQuery("")
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

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setResults([])
        setHoverIndex(null)
      }

    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [])

  useEffect(() => {

    if (selectedContact) {
      setResults([])
      return
    }

    if (!query) {
      setResults([])
      return
    }

    const q = query.toLowerCase()

    const filtered = contactIndex
      .filter(c => c.search.includes(q))
      .slice(0, 10)

    setResults(filtered)

  }, [query, contactIndex, selectedContact])

  async function startOnboarding() {

    if (!selectedContact) return

    try {

      const name = selectedContact.raw.split("|")[0].trim()

      const fn = catalystRef.current.function.functionId("createOnboardingSessionV2")

      const response = await fn.execute({
        args: {
          contactId: selectedContact.id,
          contactName: name
        }
      })

      const data = await response.json()

      console.log("Onboarding session created:", data)

      navigate("/onboarding/" + data.sessionId)

    } catch (err) {

      console.error("Failed to start onboarding:", err)

    }

  }

  return (

    <Routes>

      <Route
        path="/"
        element={
          <Home
            user={user}
            loading={loading}
            sessionsLoading={sessionsLoading}
            searchRef={searchRef}
            query={query}
            setQuery={setQuery}
            handleKeyDown={handleKeyDown}
            results={results}
            hoverIndex={hoverIndex}
            setHoverIndex={setHoverIndex}
            selectContact={selectContact}
            selectedContact={selectedContact}
            clearSelection={clearSelection}
            startOnboarding={startOnboarding}
            sessions={sessions}
          />
        }
      />

      <Route
        path="/onboarding/:sessionId"
        element={<Onboarding />}
      />

    </Routes>

  )

}

function Home(props) {

  const {
    user,
    loading,
    searchRef,
    query,
    setQuery,
    handleKeyDown,
    results,
    hoverIndex,
    setHoverIndex,
    selectContact
  } = props

  return (

    <div style={{
      paddingTop: "120px",
      fontFamily: "Arial",
      textAlign: "center"
    }}>

      {user && (
        <div style={{ fontSize: "13px", marginBottom: "10px", color: "#666" }}>
          Logged in as: {user.first_name} {user.last_name} ({user.email_id})
        </div>
      )}

      <h1>MTD Onboarding Tool</h1>

      {loading && (
        <div style={{
          width: "320px",
          margin: "40px auto"
        }}>
          <div className="shimmer" />
          <div className="shimmer" />
          <div className="shimmer" />
        </div>
      )}

      {!loading && (

        <div
          ref={searchRef}
          style={{
            width: "320px",
            margin: "0 auto",
            position: "relative"
          }}
        >

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
