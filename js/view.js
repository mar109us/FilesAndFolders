function updateView() {
   document.getElementById("app").innerHTML = `
        <h1>Filer og mapper</h1>
        Du er her: ${createSummarySelected()}<br/>
        ${actions()}<br/>
        ${createFoldersHtml()}
        ${createFilesHtml()}
        ${createEditFileHtml()}
    `;
}

function actions() {
   return `
      ${editField()}
   `;
}

function editField() {
   if (model.state.newFolder.active) {
      return `
      <button onclick="newFolder()">Ny mappe</button><br/>
      <input oninput="model.state.newContent = this.value" type="text"></input><br/>
      <button onclick="createFolder()">Lagre</button>
      <button onclick="cancelCreate()">Avbryt</button>`;
   }
   if (model.state.newFile.active) {
      return `
      <button onclick="newFile()">Ny fil</button><br/>
      <input oninput="model.state.newContent = this.value" type="text"></input><br/>
      <button onclick="createFile()">Lagre</button>
      <button onclick="cancelCreate()">Avbryt</button>`;
   } else
      return `
      <button onclick="newFolder()">Ny mappe</button>
      <button onclick="newFile()">Ny fil</button>
   `;
}

function createFolder() {
   const currentId = model.app.currentId;
   const currentFile = model.filesAndFolders.find((f) => f.id == currentId);
   model.state.newContent = currentFile.content;
   select(currentFile.parentId);
}

function createFile() {

}

function cancelCreate() {
   model.state.newContent = ""
   model.state.newFile.active = false;
   model.state.newFolder.active = false;
   updateView()
}


function newFolder() {
   model.state.newFolder.active = !model.state.newFolder.active;
   model.state.newFile.active = false;
   updateView();
}

function newFile() {
   model.state.newFile.active = !model.state.newFile.active;
   model.state.newFolder.active = false;
   updateView();
}

function createSummarySelected() {
   let id = model.app.currentId;
   if (id == null) return "<i>rotmappe</i>";
   let breadcrumbs = "";
   while (id) {
      let fileOrFolder = model.filesAndFolders.find((f) => f.id == id);
      if (breadcrumbs != "") breadcrumbs = " > " + breadcrumbs;
      breadcrumbs = fileOrFolder.name + breadcrumbs;
      id = fileOrFolder.parentId;
   }
   return breadcrumbs;
}

function createFoldersHtml() {
   let currentId = model.app.currentId;
   const currentFileOrFolder = model.filesAndFolders.find((f) => f.id == currentId);
   let html = "";
   if (currentFileOrFolder != null) {
      html = `📁 <a href="javascript:select(${currentFileOrFolder.parentId})">..</a><br/>`;
      if (currentFileOrFolder.hasOwnProperty("content")) currentId = currentFileOrFolder.parentId;
   }
   for (let folder of model.filesAndFolders) {
      if (folder.hasOwnProperty("content") || folder.parentId != currentId) continue;
      html += `📁 <a href="javascript:select(${folder.id})">${folder.name}</a><br/>`;
   }
   return html;
}

function createFilesHtml() {
   let currentId = model.app.currentId;
   const currentFileOrFolder = model.filesAndFolders.find((f) => f.id == currentId);
   if (currentFileOrFolder != null) {
      if (currentFileOrFolder.hasOwnProperty("content")) currentId = currentFileOrFolder.parentId;
   }
   let html = "";
   for (let file of model.filesAndFolders) {
      if (!file.hasOwnProperty("content") || file.parentId != currentId) continue;
      html += `<span>🗎</span> <a href="javascript:select(${file.id})">${file.name}</a><br/>`;
   }
   return html;
}

function createEditFileHtml() {
   const currentId = model.app.currentId;
   if (currentId == null) return "";
   const currentFile = model.filesAndFolders.find((f) => f.id == currentId);
   if (!currentFile.hasOwnProperty("content")) return "";
   return /*HTML*/ `
        <textarea oninput="model.state.newContent = this.value">${currentFile.content}</textarea>    
        <br/>
        <button onclick="saveFile()">Lagre</button>
        <button onclick="cancelEdit()">Avbryt</button>
    `;
}

function saveFile() {
   const currentId = model.app.currentId;
   const currentFile = model.filesAndFolders.find((f) => f.id == currentId);
   currentFile.content = model.state.newContent;
   select(currentFile.parentId);
}

function cancelEdit() {
   const currentId = model.app.currentId;
   const currentFile = model.filesAndFolders.find((f) => f.id == currentId);
   model.state.newContent = currentFile.content;
   select(currentFile.parentId);
}
