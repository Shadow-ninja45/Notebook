
const crudCrudBaseUrl = 'https://crudcrud.com/api/f035900ebcef4723bb4d0b28e5a2dd3d';

let totalNotes = 0;
let showingNotes = 0;

// Function to fetch and display notes from the CrudCrud API
async function fetchAndDisplayNotes(searchQuery = '') {
    const response = await fetch(`${crudCrudBaseUrl}/notes`);
    const notes = await response.json();

    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    //console.log(filteredNotes)
    
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    filteredNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('list-group-item', 'note-card');
        noteCard.innerHTML = `
            <h5>${note.title}</h5>
            <p>${note.description}</p>
            <button class="btn btn-danger btn-sm float-end" onclick="deleteNote('${note._id}')">Delete</button>
        `;
        notesList.appendChild(noteCard);
    });

    // Update counters
    totalNotes = notes.length;
    showingNotes = filteredNotes.length;
    document.getElementById('totalNotes').innerText = `Total Notes: ${totalNotes}`;
    document.getElementById('showingNotes').innerText = `Showing: ${showingNotes}`;
}

// Function to handle form submission and add a new note
async function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('noteTitle').value;
    const description = document.getElementById('noteDescription').value;

    await fetch(`${crudCrudBaseUrl}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
    });

    document.getElementById('noteTitle').value = '';
    document.getElementById('noteDescription').value = '';

    fetchAndDisplayNotes();
}

async function deleteNote(noteId) {
    await fetch(`${crudCrudBaseUrl}/notes/${noteId}`, {
        method: 'DELETE'
    });

    fetchAndDisplayNotes();
}


function handleSearchInput(event) {
    const searchQuery = event.target.value;
    fetchAndDisplayNotes(searchQuery);
}


document.getElementById('noteForm').addEventListener('submit', handleFormSubmit);
document.getElementById('searchBar').addEventListener('input', handleSearchInput);

// Initial fetch and display of notes
fetchAndDisplayNotes();
