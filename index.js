const form = document.querySelector("form");
const scheduleList = document.querySelector("ul");

function renderItems(doc) {
  let li = document.createElement("li");
  let cross = document.createElement("div");

  cross.textContent = "delete";
  cross.style.cursor = "pointer";
  cross.style.color = "blue";

  li.innerHTML = `
      <b>Interviewer Email:</b> <span>${doc.data().interviewer}</span> <br /> 
      <b>Interviewee Email:</b> <span>${doc.data().interviewee}</span> <br /> 
      <b>Interview Date:</b> <span>${doc.data().date}</span> <br /> 
      <b>Start Time:</b> <span>${doc.data().sTime}</span> <br/>
      <b>End Time:</b> <span>${doc.data().eTime}</span> <br/>
    `;
  li.appendChild(cross);
  li.setAttribute("doc-id", doc.id);
  scheduleList.appendChild(li);

  //deleting data from firestore
  cross.addEventListener("click", (event) => {
    let id = event.target.parentElement.getAttribute("doc-id");
    db.collection("schedules").doc(id).delete();
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const interviewer = event.target.interviewer.value;
  const interviewee = event.target.interviewee.value;
  const date = event.target.date.value;
  const sTime = event.target.sTime.value;
  const eTime = event.target.eTime.value;
  const dateObj = new Date();
  const currentYear = dateObj.getFullYear();
  const today = dateObj.getDate();
  const currentMonth = dateObj.getMonth() + 1;
  const myArray = date.split("-");

  console.log(myArray,today,currentMonth,currentYear);

  myArray[0]=parseInt(myArray[0]);
  myArray[1]=parseInt(myArray[1]);
  myArray[2]=parseInt(myArray[2]);

  if(myArray[2]<today || myArray[1]<currentMonth || myArray[0]<currentYear){
    alert("please select correct date");
    return;
  }
  
  if(sTime > eTime){
    alert("please select correct time");
    return;
  }
  


  db.collection("schedules").add({
    interviewer: event.target.interviewer.value,
    interviewee: event.target.interviewee.value,
    date: event.target.date.value,
    sTime: event.target.sTime.value,
    eTime: event.target.eTime.value,
  });

  event.target.interviewer.value = "";
  event.target.interviewee.value = "";
  event.target.date.value = "";
  event.target.sTime.value = "";
  event.target.eTime.value = "";
});

db.collection("schedules")
  .orderBy("date")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") renderItems(change.doc);
      else if (change.type == "removed") {
        let li = scheduleList.querySelector("[doc-id=" + change.doc.id + "]");
        scheduleList.removeChild(li);
      }
    });
  });
