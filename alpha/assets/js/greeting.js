function getGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1; // Add 1 to adjust for 0-based month index
    const day = now.getDate();
  
    // Time-based greetings
    let timeGreeting = '';
    if (hour >= 5 && hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }
  
    // Recognize globally recognized days
    const globalDays = [
      { month: 1, day: 1, greeting: 'Happy New Year' },
      { month: 2, day: 14, greeting: 'Happy Valentine\'s Day' },
      { month: 4, day: 22, greeting: 'Happy Earth Day' },
      { month: 5, day: 9, greeting: 'Happy International Mother\'s Day' },
      { month: 6, day: 1, greeting: 'Happy International Children\'s Day' },
      { month: 6, day: 20, greeting: 'Happy International Father\'s Day' },
      { month: 9, day: 27, greeting: 'Happy World Tourism Day' },
      { month: 9, day: 29, greeting: 'Happy World Heart Day' },
      { month: 10, day: 10, greeting: 'Happy World Mental Health Day' },
      { month: 11, day: 11, greeting: 'Happy Veterans Day' },
      { month: 11, day: 11, greeting: 'Happy Singles\' Day' },
      { month: 11, day: 11, greeting: 'Happy Remembrance Day' },
      { month: 11, day: 11, greeting: 'Happy Armistice Day' },
      { month: 11, day: 12, greeting: 'Happy Diwali' },
      { month: 11, day: 24, greeting: 'Happy Thanksgiving' },
      { month: 11, day: 30, greeting: 'Happy St. Andrew\'s Day' },
      { month: 12, day: 25, greeting: 'Happy Christmas' },
      // Add more recognized days here
    ];
  
    const todayGreeting = globalDays.find(info => info.month === month && info.day === day);
  
    if (todayGreeting) {
      return `${todayGreeting.greeting} and ${timeGreeting}!`;
    }
  
    return timeGreeting;
  }
  
  const greeting = getGreeting();
  console.log(greeting);
  
  


document.getElementById('smallNotiText').innerText = greeting;
