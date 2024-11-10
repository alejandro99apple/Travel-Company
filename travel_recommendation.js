let myData;

// Navigation
document.addEventListener('DOMContentLoaded', function() {
    const mainHeroSection = document.querySelector('.hero-section:not(#aboutSection .hero-section):not(#contactSection .hero-section)');
    const aboutSection = document.getElementById('aboutSection');
    const contactSection = document.getElementById('contactSection');
    const aboutLink = document.querySelector('a[href="about.html"]');
    const contactLink = document.querySelector('a[href="contact.html"]');
    const homeLink = document.querySelector('a[href="index.html"]');

    function hideAllSections() {
        mainHeroSection.style.display = 'none';
        aboutSection.style.display = 'none';
        contactSection.style.display = 'none';
    }

    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllSections();
        aboutSection.style.display = 'block';
    });

    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllSections();
        contactSection.style.display = 'block';
    });

    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllSections();
        mainHeroSection.style.display = 'block';
    });
});





// Function to validate the Contact Us form
function validateForm() {
    const form = document.getElementById('contactForm');
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    
    let isValid = true;
    
    // Clear previous error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    // Validate name
    if (!name.value.trim()) {
        isValid = false;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.textContent = 'Please enter your name';
        name.parentNode.appendChild(errorDiv);
    }
    
    // Validate email
    if (!email.value.trim() || !email.value.includes('@')) {
        isValid = false;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.textContent = 'Please enter a valid email';
        email.parentNode.appendChild(errorDiv);
    }
    
    // Validate message
    if (!message.value.trim()) {
        isValid = false;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.textContent = 'Please enter a message';
        message.parentNode.appendChild(errorDiv);
    }
    
    if (isValid) {
        confirm("Message submitted");
        // Reset form
        form.reset();
    }
}




fetch('travel_recommendation_api.json')
.then(response => response.json())
.then(data => {
    myData = data;
    console.log(myData);
})

// Get search elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');

// Function to search recommendations
function searchRecommendations() {
    const searchTerm = searchInput.value.toLowerCase();
    let results = [];
    
    // Search through countries and cities
    myData.countries.forEach(country => {
        // Check country name
        if (country.name.toLowerCase().includes(searchTerm)) {
            results = results.concat(country.cities);
        }
        
        // Check each city
        country.cities.forEach(city => {
            // Search in city name and description
            if (
                city.name.toLowerCase().includes(searchTerm) ||
                city.description.toLowerCase().includes(searchTerm)
            ) {
                results.push(city);
            }
        });
    });


    //Search through beaches
    if(searchTerm.includes('beach'||'beaches')){
        myData.beaches.forEach(beach => {
           results.push(beach);
        });
    }


    myData.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(searchTerm)||((searchTerm.includes('beach') || searchTerm.includes('beaches')) && 
            beach.description.toLowerCase().includes('beach')
        )) {
            results.push(beach);
        }
    });



    //Search through temples
    if(searchTerm.includes('temple'||'temples')){
        myData.temples.forEach(temple => {
           results.push(temple);
        });
    }
    myData.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(searchTerm)||((searchTerm.includes('temple') || searchTerm.includes('temples')) || temple.description.toLowerCase().includes('temple')
        )) {
            results.push(temple);
        }
    });
    
    // Eliminar duplicados basándose en el nombre de la ciudad/lugar
    results = results.filter((item, index, self) =>
        index === self.findIndex((t) => t.name === item.name)
    );
    displayResults(results);
}



// Function to display search results
function displayResults(results) {
    // Remove existing results if any
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
    
    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    resultsContainer.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        width: 40vw;
        max-height: 80vh;
        overflow-y: auto;
        padding: 20px;
        background-color: rgba(255, 255, 255, 0);
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron resultados</p>';
    } else {
        results.forEach(result => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                margin-bottom: 20px;
                overflow: hidden;
            `;
            
            card.innerHTML = `
                <img src="${result.imageUrl}" alt="${result.name}" style="width: 100%; height: 150px; object-fit: cover;">
                <div style="padding: 15px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 18px;">${result.name}</h3>
                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">${result.description}</p>
                    <button style="
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        width: 100%;
                    ">Visitar</button>
                </div>
            `;
            
            resultsContainer.appendChild(card);
        });
    }
    
    document.body.appendChild(resultsContainer);
}

// Add event listeners
searchBtn.addEventListener('click', searchRecommendations);

// Reset functionality
resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
});

// Allow search on Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchRecommendations();
    }
});

