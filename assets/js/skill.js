// Create the array of software names
const software = [
    "KISSsoft",
    "Ansys Mechanical",
    "SOLIDWORKS",
    "Fusion 360",
    "CATIA",
    "AutoCAD",
    "MATLAB",
    "Creo",
    "Arbortext Editor",
    "IsoDraw",
    "Minitab Statistical Software",
    "Google Analytics",
    "Power Automate",
    "Word",
    "Excel",
    "PowerPoint",
    "VS Code",
    "Git",
    "HTML",
    "CSS",
    "JavaScript",
    "C",
    "Java",
    "Python"
  ];
  
  // Function to generate the HTML structure
  function generateSoftwareSection(softwareList) {
    const skillSection = document.getElementById("skill_section");
  
    softwareList.forEach(softwareName => {
      const article = document.createElement("article");
  
      const h1 = document.createElement("h1");
      h1.textContent = softwareName;
  
      const p = document.createElement("p");
      p.textContent = "#CAD/CAM"; // You can adjust the category here
  
      const skillBase = document.createElement("div");
      skillBase.classList.add("skillBase");
  
      const skillBaseIcon = document.createElement("span");
      skillBaseIcon.classList.add("skillBaseIcon");
  
      const coursesIcon = document.createElement("span");
      coursesIcon.classList.add("material-symbols-rounded");
      coursesIcon.title = "courses";
      coursesIcon.innerHTML = "school";
  
      const coursesNumber = document.createElement("span");
      coursesNumber.classList.add("number_of_skillbase");
      coursesNumber.textContent = "2"; // You can replace this with dynamic values
  
      const projectsIcon = document.createElement("span");
      projectsIcon.classList.add("material-symbols-rounded");
      projectsIcon.title = "projects";
      projectsIcon.innerHTML = "engineering";
  
      const projectsNumber = document.createElement("span");
      projectsNumber.textContent = "4"; // You can replace this with dynamic values
  
      skillBaseIcon.appendChild(coursesIcon);
      skillBaseIcon.appendChild(coursesNumber);
      skillBaseIcon.appendChild(document.createTextNode(" ")); // Add space between icons
      skillBaseIcon.appendChild(projectsIcon);
      skillBaseIcon.appendChild(projectsNumber);
  
      skillBase.appendChild(skillBaseIcon);
  
      article.appendChild(h1);
      article.appendChild(p);
      article.appendChild(skillBase);
  
      skillSection.appendChild(article);
    });
  }
  
  // Call the function to generate the HTML
  generateSoftwareSection(software);
  