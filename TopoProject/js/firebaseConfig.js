$(document).ready(function () {
    $("select").formSelect();
});

toastr.options = {
    "positionClass": "toast-top-full-width"
};

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

$("#submitBtn").on("click", function () {
    const projectName = $("#projectName").val().trim();
    const sector = $("#sector :selected").text();
    const services = $("#services :selected").text();
    const projectDescription = $("#projectDescription").val();
    const longitude = +$("#longitude").val();
    const latitude = +$("#latitude").val();

    if (!projectName.trim()) {
        toastr.warning("Project Name is Required!");
    }
    else {
        addData(projectName, sector, services, projectDescription, longitude, latitude)
    }
});

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
            console.log("Added Doc with Id: ${docRef.id}")
            toastr.success(`${docRef.id}`, "Added Successfully Doc with Id:")
        })
        .then(function (redirect) {
            // window.location.replace("http://195.96.242.219:6585/bteng_maps_demo/index_en.html"); // or assign if you want to go back to prev page
        })
        .catch(function (error) {
            console.log("Error adding document:", error)
            toastr.error(`${error}`, "Error adding document:")
        });
}

$("#getDataBtn").on("click", function () {
    db.collection("pointsInfo").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`Doc Id: ${doc.id} => Proj Descr: ${doc.data().properties.projectDescription}`);
            });
        })
        .catch(function (error) {
            console.log("Error getting document:", error)
            toastr.error(`${error}`, "Error getting document:")
        });
});

$("#updateMenu").on("click", function () {
    $("#updateInput").toggle();
});


$("#searchBtn").on("click", function () {
    const pName = $("#pName").val();

    db.collection("pointsInfo").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if ((doc.data().properties.projectName).toLowerCase() === pName.toLowerCase()) {
                    toastr.info("Project Document was found Successfully!")

                    // $("#sector").text(doc.data().properties.services);
                    // $("#services").text(doc.data().properties.services);
                    $("#projectName").val(doc.data().properties.projectName);
                    $("#projectDescription").val(doc.data().properties.projectDescription);
                    $("#longitude").val(doc.data().geometry.cordinates[0]);
                    $("#latitude").val(doc.data().geometry.cordinates[1]);

                    $("#updateBtn")
                        .removeClass("btn disabled")
                        .addClass("waves-effect waves-light btn")
                        .on("click", function () {
                            const docRef = db.doc(`pointsInfo/${doc.id}`);
                            docRef.update({
                                geometry: {
                                    type: "Point",
                                    cordinates: [+$("#longitude").val(), +$("#latitude").val()] // longtitude, latitude
                                },
                                properties: {
                                    projectName: `${$("#projectName").val()}`,
                                    sector: `${$("#sector :selected").text()}`,
                                    services: `${$("#services :selected").text()}`,
                                    projectDescription: `${$("#projectDescription").val()}`
                                }
                            })
                                .then(toastr.success(`${docRef.id}`, "Updated Successfully Doc with Id:"))
                                .catch(function (error) {
                                    toastr.error(`${error}`, "Error updating document:")
                                });
                        });
                }
                else {
                    $("#updateBtn").removeClass("waves-effect waves-light btn").addClass("btn disabled");
                    toastr.info(`Project with the name: "${pName.toUpperCase()}" was not found`);
                    console.log(`Project with the name: "${pName.toUpperCase()}" was not found`);
                }
            });
        })
});