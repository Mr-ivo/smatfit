document.addEventListener('DOMContentLoaded', function() {
    // Get user data from localStorage (set during login/signup)
    function getUserInitials() {
        const userData = JSON.parse(localStorage.getItem('userData')) || { name: 'John Doe' };
        const names = userData.name.split(' ');
        return names.map(name => name[0]).join('').toUpperCase();
    }

    // Set user initials
    const userInitialsElements = document.querySelectorAll('.user-initials');
    const initials = getUserInitials();
    userInitialsElements.forEach(element => {
        element.textContent = initials;
    });

    // Mobile Navigation
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle && closeSidebar && sidebar) {
        function toggleSidebar() {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        }

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });

        closeSidebar.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                toggleSidebar();
            }
        });
    }

    // Handle window resize
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        if (window.innerWidth !== lastWidth) {
            lastWidth = window.innerWidth;
            if (window.innerWidth >= 1025) {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        }
    });

    // Navigation active state
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            if (window.innerWidth < 1025) {
                toggleSidebar();
            }
        });
    });

    const bookClassBtn = document.querySelector('.action-btn');
    bookClassBtn.addEventListener('click', () => {
        window.location.href = 'schedule.html';
    });

    // Join Class Buttons
    const joinClassBtns = document.querySelectorAll('.join-class');
    joinClassBtns.forEach(button => {
        button.addEventListener('click', () => {
            button.textContent = 'Joined';
            button.style.backgroundColor = '#4caf50';
            button.disabled = true;
        });
    });

    // Logout functionality
    const logoutBtn = document.querySelector('.logout-button');
    logoutBtn.addEventListener('click', () => {
        // Clear user data
        localStorage.removeItem('userData');
        // Redirect to login page
        window.location.href = 'login.html';
    });

    // Initialize Charts
    const workoutCtx = document.getElementById('workoutChart').getContext('2d');
    const goalCtx = document.getElementById('goalChart').getContext('2d');

    // Sample data for workout activity
    const workoutData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Workout Minutes',
            data: [60, 45, 75, 50, 80, 65, 45],
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            borderColor: '#4361ee',
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: '#4361ee'
        }]
    };

    // Sample data for goal progress
    const goalData = {
        labels: ['Cardio', 'Strength', 'Flexibility', 'Weight'],
        datasets: [{
            label: 'Current',
            data: [75, 68, 85, 60],
            backgroundColor: [
                'rgba(67, 97, 238, 0.6)',
                'rgba(247, 37, 133, 0.6)',
                'rgba(76, 175, 80, 0.6)',
                'rgba(255, 152, 0, 0.6)'
            ],
            borderWidth: 0
        }]
    };

    // Workout Activity Line Chart
    const workoutChart = new Chart(workoutCtx, {
        type: 'line',
        data: workoutData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Goal Progress Radar Chart
    const goalChart = new Chart(goalCtx, {
        type: 'radar',
        data: goalData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Chart Period Filters
    const chartFilters = document.querySelectorAll('.chart-filters button');
    chartFilters.forEach(button => {
        button.addEventListener('click', () => {
            chartFilters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // In a real app, this would fetch new data based on the selected period
            updateChartsData(button.textContent.toLowerCase());
        });
    });

    function updateChartsData(period) {
        // Sample data updates based on period
        const periodicData = {
            week: {
                workout: [60, 45, 75, 50, 80, 65, 45],
                goals: [75, 68, 85, 60]
            },
            month: {
                workout: [65, 50, 70, 55, 75, 60, 50],
                goals: [80, 72, 88, 65]
            },
            year: {
                workout: [70, 55, 65, 60, 70, 55, 55],
                goals: [85, 75, 90, 70]
            }
        };

        // Update workout chart
        workoutData.datasets[0].data = periodicData[period].workout;
        workoutChart.update();

        // Update goals chart
        goalData.datasets[0].data = periodicData[period].goals;
        goalChart.update();
    }

    // Notification Badge Click
    const notificationBtn = document.querySelector('.notification-btn');
    notificationBtn.addEventListener('click', () => {
        // In a real app, this would open a notifications panel
        alert('Notifications feature coming soon!');
    });

    // Add Meal Button
    const addMealBtn = document.querySelector('.add-meal');
    addMealBtn.addEventListener('click', () => {
        // In a real app, this would open a meal tracking modal
        alert('Meal tracking feature coming soon!');
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // In a real app, this would filter content based on search term
        console.log('Searching for:', searchTerm);
    });

    // Initialize circular progress bars for nutrition
    const nutritionCircles = document.querySelectorAll('.nutrition-progress circle:nth-child(2)');
    nutritionCircles.forEach(circle => {
        const percent = parseInt(circle.parentElement.nextElementSibling.textContent);
        const offset = 220 - (220 * percent) / 100;
        circle.style.strokeDashoffset = offset;
    });

    // Handle class join buttons
    const joinButtons = document.querySelectorAll('.btn-secondary');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const classInfo = this.closest('.class-card').querySelector('.class-info h4').textContent;
            alert(`Joining ${classInfo}! A confirmation email will be sent to you.`);
            this.textContent = 'Joined';
            this.disabled = true;
            this.style.backgroundColor = '#2ecc71';
            this.style.color = 'white';
        });
    });

    // Handle plan renewal
    const renewButton = document.querySelector('.membership-status .btn-primary');
    if (renewButton) {
        renewButton.addEventListener('click', function() {
            alert('Redirecting to membership renewal page...');
        });
    }

    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Update time dynamically
    function updateDateTime() {
        const now = new Date();
        const timeElements = document.querySelectorAll('.class-time .time');
        
        timeElements.forEach(timeElement => {
            const time = timeElement.textContent;
            const [hours, minutes] = time.split(':');
            const classTime = new Date();
            classTime.setHours(parseInt(hours));
            classTime.setMinutes(parseInt(minutes));
            
            if (classTime < now) {
                const card = timeElement.closest('.class-card');
                const button = card.querySelector('.btn-secondary');
                if (button && !button.disabled) {
                    button.textContent = 'Completed';
                    button.disabled = true;
                    button.style.backgroundColor = '#95a5a6';
                }
            }
        });
    }

    // Update class status every minute
    updateDateTime();
    setInterval(updateDateTime, 60000);
});
