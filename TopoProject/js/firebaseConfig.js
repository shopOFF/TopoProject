const config = {
    apiKey: "AIzaSyAvCrNkkCthSVjLVlZriieX-hM5BcFrIRo",
    authDomain: "justtesting-b74c2.firebaseapp.com",
    databaseURL: "https://justtesting-b74c2.firebaseio.com",
    projectId: "justtesting-b74c2",
    storageBucket: "justtesting-b74c2.appspot.com",
    messagingSenderId: "1009793274374"
};

const db = initializeFirebase(config);

// Initialize Firebase
function initializeFirebase(configData) {
    firebase.initializeApp(configData);
    const db = firebase.firestore();
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    return db;
}


function sendInput() {
    const projectName = document.querySelector("#projectName").value;
    const sector = document.querySelector("#sector").value;
    const services = document.querySelector("#services").value;
    const projectDescription = document.querySelector("#projectDescription").value;
    const cordinates = document.querySelector("#cordinates").value;
    
    addData(projectName, sector, services, projectDescription, cordinates)
}

function addData(projName, sector, services, projDescription, cordinates) {
    db.collection("pointsInfo").add({
        projectName: `${projName}`,
        sector: `${sector}`,
        services: `${services}`,
        projectDescription: `${projDescription}`,
        cordinates: `${cordinates}`
         })
        .then(function (docRef) {
            console.log(`doc Id: ${docRef.id} - Added!`, )
        })
        .then(function (redirect) {
            // window.location.replace("http://195.96.242.219:6585/bteng_maps_demo/index_en.html"); // or assign if you want to go back to prev page
        })
        .catch(function (error) {
            console.log("error", error)
        });
}

function getData() {
    db.collection("pointsInfo").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`Doc Id: ${doc.id} => Proj Descr: ${doc.data().projectDescription}`);
        });
    });
}