// Create an object called 'app' with the specified parameters
const app = {
    version: "2.1.0",
    channel: "alpha",
    releaseDate: "2023-08-05"
  };
  
  // Access the properties of the 'app' object
  console.log("Version:", app.version);
  console.log("Channel:", app.channel);
  console.log("Release Date:", app.releaseDate);
  

document.getElementById("version-of-website").innerText = "Version: " + app.version + " " + app.channel;
document.getElementById("last-updated-on-date").innerText = "Last updated: " + app.releaseDate;


