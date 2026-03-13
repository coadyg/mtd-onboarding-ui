import { useState } from 'react'
import './App.css'

function App() {
  const [contacts, setContacts] = useState([])

  function loadContacts() {
    console.log("This will later call Zoho CRM")
    alert("Next step will load contacts from Zoho CRM")
  }

  return (
    <div style={{padding: "40px", fontFamily: "Arial"}}>
      <h1>MTD Onboarding Tool</h1>

      <button onClick={loadContacts}>
        Load Contacts
      </button>

      <div style={{marginTop: "30px"}}>
        {contacts.length === 0 && <p>No contacts loaded yet</p>}
      </div>
    </div>
  )
}

export default App
