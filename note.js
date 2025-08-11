// Fetch all notes
fetch("http://127.0.0.1:5000/notes")
  .then(res => res.json())
  .then(data => {
      notes = data;
      renderNotes();
  });

// Add a note
fetch("http://127.0.0.1:5000/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        title: title,
        content: content,
        date: new Date().toLocaleString()
    })
});
