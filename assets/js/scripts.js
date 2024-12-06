const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

/* Theme */
function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
        darkModeToggle.innerHTML = '☀️';
        darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
        document.querySelector("link[rel='icon']").href = 'assets/img/favicon-light.ico';
        document.querySelector("a.logo img").src = 'assets/img/favicon-nobg-dark.png';
    } else {
        body.classList.remove('light-mode');
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
        document.querySelector("link[rel='icon']").href = 'assets/img/favicon-dark.ico';
        document.querySelector("a.logo img").src = 'assets/img/favicon-nobg-light.png';
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme('light');
} else {
    setTheme('dark');
}

darkModeToggle.addEventListener('click', () => {
    const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'light' : 'dark');
    }
});

/* Supported Websites */
const websites = ['Linkvertise', 'Admaven (Lootlabs/Lootlinks)', 'Paster.so', 'Work.ink', 'Boost.ink', 'Mboost.me', 'Socialwolvez.com', 'Sub2get.com', 'Social-unlock.com', 'Sub2unlock.com', 'Sub2unlock.net', 'Sub2unlock.io', 'Sub4unlock.io', 'Rekonise.com', 'Adfoc.us', 'URL shortener'];
let currentIndex = Math.floor(Math.random() * websites.length);
const supportedWebsitesElement = document.querySelector('.supported-websites');
supportedWebsitesElement.style.transition = 'opacity 0.5s ease-in-out';

setInterval(() => {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * websites.length);
    } while (nextIndex === currentIndex);
    
    currentIndex = nextIndex;
    supportedWebsitesElement.style.opacity = '0';
    
    setTimeout(() => {
        supportedWebsitesElement.textContent = websites[currentIndex];
        supportedWebsitesElement.style.opacity = '1';
    }, 500);
}, 6500);

/* Navigation */
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('nav ul');

    hamburger.addEventListener('click', function() {
        navList.classList.toggle('show');
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav')) {
            navList.classList.remove('show');
        }
    });
});