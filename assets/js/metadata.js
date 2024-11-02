// Create an object called 'app' with the specified parameters
const app = {
  version: "2.1.0",
  channel: "alpha",
  releaseDate: "2023-08-05"
};

var show_experimental_features = false;

// Access the properties of the 'app' object
console.log("Version:", app.version);
console.log("Channel:", app.channel);
console.log("Release Date:", app.releaseDate);


document.getElementById("version-of-website").innerText = "Version: " + app.version + " " + app.channel;
document.getElementById("last-updated-on-date").innerText = "Last updated: " + app.releaseDate;


// -----------------------

function updateGreetingAndExperience() {
  const today = new Date();
  const startDate = new Date('2021-03-01');
  const monthsDiff = (today.getFullYear() - startDate.getFullYear()) * 12 + today.getMonth() - startDate.getMonth();
  const yearsExperience = monthsDiff / 12;

  const paragraph = document.getElementById('experience-paragraph');
  const currentHour = today.getHours();
  let greeting = '';

  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  paragraph.textContent = `${greeting} there, I am a working professional with ${yearsExperience.toFixed(1)} years of experience in product design with expertise at FEA, 3D CAD, GD&T.`;
}

// Initial update on page load
updateGreetingAndExperience();

// Update every hour to keep it accurate
// setInterval(updateGreetingAndExperience, 60 * 60 * 1000); 

