$(document).ready(function () {
    $('select').formSelect();
});

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
    const settings = {
        timestampsInSnapshots: true
    };
    db.settings(settings);

    return db;
}


function sendInput() {
    const projectName = $("#projectName").val();
    const sector = $("#sector :selected").text();
    const services = $("#services :selected").text();
    const projectDescription = $("#projectDescription").val();
    const longitude = +$("#longitude").val();
    const latitude = +$("#latitude").val();

    addData(projectName, sector, services, projectDescription, longitude, latitude)
}

//https://leafletjs.com/examples/geojson/sample-geojson.js refferences
//http://geojson.org/

function addData(projName, sector, services, projDescription, lon, lat) {
    db.collection("pointsInfo").add({
        type: "Feature",
        geometry: {
            type: "Point",
            cordinates: [lon, lat] // longtitude, latitude
        },
        properties: {
            projectName: `${projName}`,
            sector: `${sector}`,
            services: `${services}`,
            projectDescription: `${projDescription}`
        }
    })
        .then(function (docRef) {
            console.log(`Doc with Id: ${docRef.id} - Added!`)
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
            console.log(`Doc Id: ${doc.id} => Proj Descr: ${doc.data().properties.projectDescription}`);
        });
    });
}

$("#updateBtn").on('click', function () {
    $("#updateMenu").show();
   
});


$("#searchBtn").on('click', function () {
    const pName = $("#pName").val();

    db.collection("pointsInfo").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if ((doc.data().properties.projectName).toLowerCase() === pName.toLowerCase()) {

                    const docRef = db.doc(`pointsInfo/${doc.id}`);
                    docRef.update({
                        properties: {
                            projectDescription: "testing againg to seee"
                        }
                    });
                }
                else {
                    $(document).ready(function () {
                        alert('Project with the name provided was not found');
                    });
                }
                //console.log(`Doc Id: ${doc.id} => Proj Descr: ${doc.data().properties.projectDescription}`);
            });
        });
});

