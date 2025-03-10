document.addEventListener('DOMContentLoaded', function() {
    // Sample class data - in a real app, this would come from a backend
    const classes = [
        {
            id: 1,
            title: 'Morning Yoga Flow',
            type: 'yoga',
            instructor: 'Sarah Johnson',
            time: '7:00 AM',
            duration: 60,
            location: 'Studio 2',
            capacity: { current: 12, max: 15 },
            description: 'Start your day with energizing yoga poses and meditation. Perfect for all levels, this class will help you improve flexibility, build strength, and find inner peace.'
        },
        {
            id: 2,
            title: 'HIIT Blast',
            type: 'hiit',
            instructor: 'Mike Thompson',
            time: '8:30 AM',
            duration: 45,
            location: 'Main Floor',
            capacity: { current: 8, max: 12 },
            description: 'High-intensity interval training that combines cardio and strength exercises. Get ready to sweat and burn calories in this energetic class!'
        },
        {
            id: 3,
            title: 'Power Strength',
            type: 'strength',
            instructor: 'David Chen',
            time: '10:00 AM',
            duration: 60,
            location: 'Weight Room',
            capacity: { current: 10, max: 10 },
            description: 'Build muscle and increase strength with this comprehensive weight training session. Focus on proper form and progressive overload.'
        },
        {
            id: 4,
            title: 'Cardio Dance',
            type: 'cardio',
            instructor: 'Maria Garcia',
            time: '5:30 PM',
            duration: 45,
            location: 'Studio 1',
            capacity: { current: 15, max: 20 },
            description: 'Dance your way to fitness with this fun and energetic cardio workout. No dance experience needed!'
        }
    ];

    // Initialize date navigation
    const currentDate = new Date();
    const currentMonth = document.getElementById('currentMonth');
    const currentYear = document.getElementById('currentYear');
    
    function updateDateDisplay() {
        currentMonth.textContent = currentDate.toLocaleString('default', { month: 'long' });
        currentYear.textContent = currentDate.getFullYear();
    }
    
    document.getElementById('prevWeek').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateDateDisplay();
        updateWeekDays();
    });
    
    document.getElementById('nextWeek').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateDateDisplay();
        updateWeekDays();
    });

    // Update week days
    function updateWeekDays() {
        const weekdays = document.querySelectorAll('.weekday');
        const monday = getMonday(currentDate);
        
        weekdays.forEach((day, index) => {
            const date = new Date(monday);
            date.setDate(date.getDate() + index);
            
            const dayName = day.querySelector('.day-name');
            const dayDate = day.querySelector('.day-date');
            
            dayName.textContent = date.toLocaleString('default', { weekday: 'short' });
            dayDate.textContent = date.getDate();
            
            // Highlight current day
            if (isSameDay(date, new Date())) {
                day.classList.add('active');
            } else {
                day.classList.remove('active');
            }
        });
    }

    function getMonday(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    }

    function isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    // Initialize filters
    const filterChips = document.querySelectorAll('.filter-chip');
    let activeFilter = 'all';

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.dataset.filter;
            renderClasses();
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchClasses');
    let searchQuery = '';

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderClasses();
    });

    // Render classes in timeline
    function renderClasses() {
        const timelineEvents = document.getElementById('timelineEvents');
        timelineEvents.innerHTML = '';

        classes.forEach(classItem => {
            // Filter by type and search query
            if ((activeFilter === 'all' || classItem.type === activeFilter) &&
                (classItem.title.toLowerCase().includes(searchQuery) || 
                 classItem.instructor.toLowerCase().includes(searchQuery))) {
                
                const classCard = createClassCard(classItem);
                timelineEvents.appendChild(classCard);
            }
        });
    }

    function createClassCard(classItem) {
        const card = document.createElement('div');
        card.className = `class-card ${classItem.type}`;
        
        // Calculate position based on time
        const [hours, minutes] = classItem.time.split(':');
        const timeInMinutes = parseInt(hours) * 60 + parseInt(minutes.split(' ')[0]);
        const startTime = 6 * 60; // 6:00 AM
        const topPosition = ((timeInMinutes - startTime) / 60) * 60; // 60px per hour
        
        card.style.top = `${topPosition}px`;
        card.style.height = `${classItem.duration}px`;
        
        card.innerHTML = `
            <h3>${classItem.title}</h3>
            <p>${classItem.time} · ${classItem.instructor}</p>
        `;

        card.addEventListener('click', () => showClassDetails(classItem));
        
        return card;
    }

    // Modal functionality
    const modal = document.getElementById('classModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const bookButton = document.getElementById('bookClass');

    function showClassDetails(classItem) {
        document.getElementById('modalClassType').textContent = classItem.type.charAt(0).toUpperCase() + classItem.type.slice(1);
        document.getElementById('modalTitle').textContent = classItem.title;
        document.getElementById('modalTime').textContent = `${classItem.time} (${classItem.duration} min)`;
        document.getElementById('modalInstructor').textContent = classItem.instructor;
        document.getElementById('modalLocation').textContent = classItem.location;
        document.getElementById('modalCapacity').textContent = `${classItem.capacity.current}/${classItem.capacity.max} spots`;
        document.getElementById('modalDescription').textContent = classItem.description;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    bookButton.addEventListener('click', () => {
        // In a real app, this would make an API call to book the class
        alert('Class booked successfully!');
        closeModal();
    });

    // Get user data from localStorage (set during login/signup)
    function getUserInitials() {
        const userData = JSON.parse(localStorage.getItem('userData')) || { name: 'John Doe' };
        const names = userData.name.split(' ');
        return names.map(name => name[0]).join('').toUpperCase();
    }

    // Set user initials
    const userInitialsElement = document.querySelector('.user-initials');
    if (userInitialsElement) {
        userInitialsElement.textContent = getUserInitials();
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('menu-open');
            // Here you can add additional menu open/close logic
        });
    }

    // Calendar functionality
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Filter chips functionality
    const calendarFilterChips = document.querySelectorAll('.calendar-filter-chip');
    calendarFilterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            calendarFilterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            // Add filter logic here
        });
    });

    // Search functionality
    const calendarSearchInput = document.querySelector('.calendar-search-bar input');
    if (calendarSearchInput) {
        calendarSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            // Add search logic here
        });
    }

    // Generate calendar days
    function generateCalendar(month, year) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) return;

        calendarGrid.innerHTML = '';

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            
            if (date.getMonth() === month) {
                dayElement.classList.add('current-month');
            }
            
            if (date.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            dayElement.textContent = date.getDate();
            calendarGrid.appendChild(dayElement);
        }
    }

    // Initialize calendar
    generateCalendar(currentMonth, currentYear);

    // Calendar navigation
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    let displayedMonth = currentMonth;
    let displayedYear = currentYear;

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            displayedMonth--;
            if (displayedMonth < 0) {
                displayedMonth = 11;
                displayedYear--;
            }
            updateCalendarHeader(displayedMonth, displayedYear);
            generateCalendar(displayedMonth, displayedYear);
        });

        nextBtn.addEventListener('click', () => {
            displayedMonth++;
            if (displayedMonth > 11) {
                displayedMonth = 0;
                displayedYear++;
            }
            updateCalendarHeader(displayedMonth, displayedYear);
            generateCalendar(displayedMonth, displayedYear);
        });
    }

    function updateCalendarHeader(month, year) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const headerElement = document.querySelector('.calendar-header h2');
        if (headerElement) {
            headerElement.textContent = `${monthNames[month]} ${year}`;
        }
    }

    // Initialize the page
    updateDateDisplay();
    updateWeekDays();
    renderClasses();
});
