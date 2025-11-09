
/* ===========================
File: content.js
Purpose: centralized content + world zones metadata
=========================== */
(() => {
  window.RN_CONTENT = {
    contact:{
      email:'web.app@rahulnatha.com',
      github:'rahulxnatha', // updated username
      linkedin:'rahulnatha'
    },
    zones:[
      // Each zone defines a portal in world-space and the dynamic scene it loads
      { id:'intro',    label:'Intro',    pos:[0,0,-10], color:0x00d4ff, onEnterXP:10 },
      { id:'projects', label:'Projects', pos:[20,0,0],   color:0x6affb3, onEnterXP:12 },
      { id:'skills',   label:'Skills',   pos:[-20,0,0],  color:0x7aa2ff, onEnterXP:8  },
      { id:'about',    label:'About',    pos:[0,0,20],   color:0xffc857, onEnterXP:6  },
      { id:'contact',  label:'Contact',  pos:[-20,0,20], color:0xff6b6b, onEnterXP:6  }
    ],
    // Placeholder data that would eventually come from Google Sheets
    projects:[
      {title:'Rotary Electro-Mechanical Actuator', subtitle:'DRDO — RCI', tags:['Actuator','Gears','FEA']},
      {title:'WEDM Machinability Study', subtitle:'B.Tech Project', tags:['Manufacturing','Optimization']},
      {title:'3D Technical Illustrations', subtitle:'Rail & Auto', tags:['Automation','Docs']}
    ],
    skills:[
      {name:'SOLIDWORKS', level:92},
      {name:'Three.js', level:82},
      {name:'ANSYS Mechanical', level:78},
      {name:'MATLAB', level:70}
    ],
    about:"Engineer focused on simulation & system design with an artistic approach to UI and interactivity.",
  };
})();

