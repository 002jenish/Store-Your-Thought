var notesData = [
  { text: "Note 1", group: "Group 1" },
  { text: "Note 2", group: "Group 2" },
  { text: "Note 3", group: "Group 1" },
  { text: "Note 4", group: "Group 3" },
  { text: "Note 5", group: "Group 2" },
  { text: "Note 6", group: "Group 1" }
];

document.getElementById("note-form").addEventListener("submit", function(event) {
  event.preventDefault();
  var noteInput = document.getElementById("note-input");
  var newPlaylistInput = document.getElementById("new-playlist-input");

  var noteText = noteInput.value;
  var newPlaylistName = newPlaylistInput.value.trim();

  if (noteText !== "") {
    saveNoteToDatabase(noteText, newPlaylistName);
    noteInput.value = "";
    newPlaylistInput.value = "";
  }
});

document.getElementById("groups-list").addEventListener("click", function(event) {
  if (event.target && event.target.nodeName === "LI") {
    var selectedGroup = event.target.textContent;
    openGroupModal(selectedGroup);
  }
});

document.getElementById("modal").addEventListener("click", function(event) {
  if (event.target && event.target.classList.contains("close")) {
    closeGroupModal();
  }
});

document.getElementById("clean-history-btn").addEventListener("click", function() {
  var notesList = document.getElementById("notes-list");
  notesList.innerHTML = ""; // Clear the notes list
});

//gelete the group
document.getElementById("clean-group-notes-btn").addEventListener("click", function() {
  var deleteAll = document.getElementById("delete-all-checkbox").checked;
  if(!deleteAll)
    alert("select the check box");
  if(deleteAll){
    var selectedGroup = prompt("Enter the name of the group to delete:");
    if (selectedGroup) {
      var groupNotesList = document.getElementById("group-notes-list");
      var groups = Array.from(groupNotesList.children);

      groups.forEach(function(group) {
        if (group.dataset.group === selectedGroup) {
          groupNotesList.removeChild(group);
        }
      });

      var groupsList = document.getElementById("groups-list");
      var groupItems = Array.from(groupsList.getElementsByTagName("li"));

      groupItems.forEach(function(groupItem) {
        if (groupItem.textContent === selectedGroup) {
          groupsList.removeChild(groupItem);
        }
      });
    }
  }
});

//delete notes from group
document.getElementById("delete-note-btn").addEventListener("click", function() {
  var deleteCheckbox = document.getElementById("delete-note-checkbox");
  var note = document.getElementById("modal-notes-list");
  if (deleteCheckbox.checked) {
    var noteDetails = document.getElementById("note-details");
    if (noteDetails) {
      note.innerHTML = ""; // Remove the note details from the modal-content

      var modalTitle = document.getElementById("modal-title").textContent;
      notesData = notesData.filter(function(note) {
        return note.group !== modalTitle;
      });
    }
  }
});


function saveNoteToDatabase(noteText, newPlaylistName) {
  var currentTime = new Date().toLocaleString(); // Get the current timestamp
  var note = {
    text: noteText,
    group: newPlaylistName,
    date: currentTime
  };

  notesData.push(note);

  var listItem = document.createElement("li");
  listItem.setAttribute("data-group", newPlaylistName);
  listItem.innerHTML = `<span class="note-timestamp">${currentTime}</span><br>${noteText}`;

  var notesList = document.getElementById("notes-list");
  if (notesList.firstChild) {
    notesList.insertBefore(listItem, notesList.firstChild);
  } else {
    notesList.appendChild(listItem);
  }

  // Update or create the playlist (group)
  var groupsList = document.getElementById("groups-list");
  var groupItems = groupsList.getElementsByTagName("li");
  var groupExists = false;

  for (var i = 0; i < groupItems.length; i++) {
    if (groupItems[i].textContent === newPlaylistName) {
      groupExists = true;
      break;
    }
  }

  if (!groupExists && newPlaylistName !== "") {
    var groupItem = document.createElement("li");
    groupItem.textContent = newPlaylistName;
    groupsList.appendChild(groupItem);
  }
}

function loadNotesByGroup(groupName) {
  var filteredNotes = notesData.filter(function(note) {
    return note.group === groupName;
  });

  var notesList = document.getElementById("notes-list");

  // Clear existing notes
  notesList.innerHTML = "";

  filteredNotes.forEach(function(note) {
    var listItem = document.createElement("li");
    listItem.setAttribute("data-group", note.group);
    listItem.innerHTML = `<span class="note-timestamp">${note.date}</span><br>${note.text}`;
    notesList.appendChild(listItem);
  });

  // Scroll to the notes list
  notesList.scrollIntoView({ behavior: 'smooth' });
}

function openGroupModal(groupName) {
  var filteredNotes = notesData.filter(function(note) {
    return note.group === groupName;
  });

  var modalTitle = document.getElementById("modal-title");
  var modalNotesList = document.getElementById("modal-notes-list");

  modalTitle.textContent = groupName;
  modalNotesList.innerHTML = "";

  filteredNotes.forEach(function(note) {
    var listItem = document.createElement("li");
    listItem.setAttribute("data-group", note.group);
    listItem.innerHTML = `<span class="note-timestamp">${note.date}</span><br>${note.text}`;
    modalNotesList.appendChild(listItem);
  });

  var modal = document.getElementById("modal");
  modal.style.display = "block";
}

function closeGroupModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}
