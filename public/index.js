const openModal= () => {
    $("#myModal").modal();
}
let fixedDataType  = [];
const tableDiv = [];
const appendSelect = (dataType) => {
    const select = document.createElement("select");
    select.id = "dataType";
    select.className += "custom-select";
    select.style.width = "60%";
    dataType.forEach(type => {
      const option = document.createElement("option");
      option.innerHTML += type;
      option.value = type;
      select.append(option);
    });
    tableDiv.forEach(type =>{
        const option = document.createElement("option");
        option.innerHTML += type.modelName;
        option.value = type.modelName + "+Table";
        select.append(option);
    });
    document.getElementById("selectoption").append(select);
}
const removeSelectNode = () => {
    document.getElementById("dataType").remove();
}
window.addEventListener("load",() => {
    const URL = "http://localhost:5000/data-type";
    fetch(URL)
    .then(data => data.json())
    .then(data => {
        fixedDataType = data;
        appendSelect(data);
    })
    .catch(err => console.log(err));
});


document.getElementById("tableButton").addEventListener("click" , openModal);
const cleanUp = () => {
    document.getElementById("titleName").value = "";
    document.getElementById("dataType").value = "";
    document.getElementById("required").checked = false;
    document.getElementById("trim").checked = false;
    document.getElementById("unique").checked = false;
}
let fields = [];
document.getElementById("addfield").addEventListener("click",() =>{
    const modelName = document.getElementById("modalName").value;
    const titleName = document.getElementById("titleName").value;
    const dataType = document.getElementById("dataType").value;
    const required = document.getElementById("required").checked;
    const trim = document.getElementById("trim").checked;
    const unique = document.getElementById("unique").checked;
    if(!modelName) {
        alert("Modal Name is required");
        return;
    }
    if(!titleName) {
        alert("Title is required");
        return;
    }
    if(!dataType ||  dataType === "Data Type") {
        alert("Data Type is required");
        return;
    }
    fields.push({title : titleName,type : dataType,required : required , trim : trim, unique : unique});   
    cleanUp();
    makeNavbar(titleName);
    // console.log(modelName , titleName, dataType , required , trim , unique);
});
const makeNavbar = (title) => {
    const li = 
    `<li class="nav-item">
      <a class="nav-link disabled">${title}</a>
    </li>`
    document.getElementById("nav").innerHTML += li;
}
const makeRequest = (data) => {
    const URL = "http://localhost:5000/get-code";
    return fetch(URL , {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body :JSON.stringify(data)
    }).then(res => res.json())
    .then(res => {
        $('#myModal').modal('toggle');
        return res._id;
    });
}
document.getElementById("createModel").addEventListener("click",async () => {
    const modelName = document.getElementById("modalName").value;
    if(!modelName) {
        alert("Model Name is required");
        return;
    }
    if(fields.length === 0)  {
        alert("U need to add atleast one Field");
        return;
    }
    const data = {modelName , items: fields, id :null};
    data.id = await makeRequest(data);

    tableDiv.push(data);
    makeDiv(tableDiv);
    fields = [];
    document.getElementById("modalName").value  = "";
    removeSelectNode();
    appendSelect(fixedDataType);
    cleanUp();
});
var LineController = connect();
const joinDiv = (table) => {
    table.items.forEach(item => {
        if(item.type.indexOf("+") !== -1) {
            let reference = item.type.split("+")[0];
            LineController.drawLine({
                left_node:table.modelName,
                right_node:reference,
                col : "red",
                width:2,
                gtype:"D"
            });
            $(`#${table.modelName}`).draggable({
                drag: function(event, ui){
                    LineController.redrawLines();
                }
            });
            $(`#${reference}`).draggable({
                drag: function(event, ui){
                    LineController.redrawLines();
                }
            });
        }
    });
}
const modifyFieldType = (data) => {
    data = data + "";
    if(data.indexOf("+") == -1) return data;
    return `${data.split("+")[0]}*`;
}
const openUpdateModal = (name , data) => {
    const mainDiv= document.getElementById("modalNameU");
    mainDiv.textContent = name;
    const table = document.getElementById("tableU");
    table.innerHTML = "";
    for(let [key , value] of Object.entries(data)) {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.style.textAlign = "left";
        th.style.padding = "3px";
        const td = document.createElement("td");
        th.textContent = key;
        td.textContent = modifyFieldType(value)?modifyFieldType(value):"false";
        tr.append(th);
        tr.append(td);
        table.append(tr);
    }
    $("#confirm-submit").modal();
}
const download = (id) => {
    window.open(`http://localhost:5000/download/${id}`);
}
const addFields = (div , table) => {
    const title = table.modelName;
    const h2 = document.createElement("h4");
    h2.textContent = title;
    h2.style.textAlign ="center";
    h2.style.paddingTop = "5px";
    h2.style.margin = "0px";
    h2.style.color = "#fff";
    h2.style.paddingTop = "5px";
    h2.style.paddingBottom = "5px";
    h2.style.backgroundColor = "#426481";
    h2.style.borderColor = "#2e6da4";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" style = "margin-left:10px;cursor:pointer;"height="16" fill="currentColor" class="bi bi-download" id = "download" viewBox="0 0 16 16">
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
    </svg>`
    const span = document.createElement("span");
    span.innerHTML +=svg;
    h2.append(span);
    span.addEventListener("click",() => download(table.id));
    div.append(h2);
    table.items.forEach(field => {
        const temp = document.createElement("div");
        temp.addEventListener("click",() => openUpdateModal(field.title, field));
        temp.style.cursor = "pointer";
        temp.style.padding = "0px 5px";
        temp.style.display = "flex";
        temp.style.justifyContent = "space-between";
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        p1.innerHTML += field.title;
        p2.textContent = modifyFieldType(field.type);
        p1.style.textAlign = 'center';
        p2.style.textAlign = 'center';
        temp.append(p1);
        temp.append(p2);
        div.append(temp);
    });
    // created At
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    p1.textContent = "createdAt";
    p2.textContent = "Date";
    p1.style.textAlign = 'center';
    p2.style.textAlign = 'center';
    const temp = document.createElement("div");
    temp.style.padding = "0px 5px";
    temp.style.display = "flex";
    temp.style.justifyContent = "space-between";
    temp.append(p1);
    temp.append(p2);
    div.append(temp);
    // updated at
    const pt1 = document.createElement("p");
    const pt2 = document.createElement("p");
    pt1.textContent = "updatedAt";
    pt2.textContent = "Date";
    pt1.style.textAlign = 'center';
    pt2.style.textAlign = 'center';
    const tempt = document.createElement("div");
    tempt.style.padding = "0px 5px";
    tempt.style.display = "flex";
    tempt.style.justifyContent = "space-between";
    tempt.append(pt1);
    tempt.append(pt2);
    div.append(tempt);
}
const makeDiv = (data) => {
    document.querySelectorAll('.dragableId').forEach(div =>{
        div.remove();
    })
    data.forEach(table => {
        const mainDiv = document.createElement("div");
        const topPos = Math.floor(Math.random()*400);
        const leftPos = Math.floor(Math.random()*500);
        mainDiv.style.width = "140px";
        mainDiv.style.height = "auto";
        mainDiv.style.position = "absolute";
        mainDiv.style.top = topPos + "px";
        mainDiv.style.left = leftPos + "px";
        mainDiv.style.backgroundColor = "#e9e7e7"
        mainDiv.className += "dragableId";
        mainDiv.id = table.modelName;
        addFields(mainDiv,table);
        document.body.append(mainDiv);
        
    });
    data.forEach(table => {
        joinDiv(table);
    });
    $(".dragableId").draggable();   
}
