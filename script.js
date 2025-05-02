function showNotificationModal(message) {
    document.getElementById("notificationMessage").innerText = message;
    const modal = document.getElementById("notificationModal");
    modal.style.display = "block";
}

function closeNotificationModal() {
    const modal = document.getElementById("notificationModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("notificationModal");
    if (event.target == modal) {
        closeNotificationModal();
    }
}

// Theme switching functionality
const themeToggle = document.getElementById('checkbox');
const currentTheme = localStorage.getItem('theme');

// Check for saved user preference and apply it
if (currentTheme) {
    document.documentElement.classList.add(currentTheme);
    
    // Update toggle position if theme is dark
    if (currentTheme === 'dark-theme') {
        themeToggle.checked = true;
    }
}

// Listen for toggle changes
themeToggle.addEventListener('change', switchTheme);

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
        
        // Add transition animation
        document.body.style.animation = 'none';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10);
    } else {
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem('theme', '');
        
        // Add transition animation
        document.body.style.animation = 'none';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10);
    }
}

async function fetchFontNames() {
    try {
        const response = await fetch('https://api.github.com/repos/bhaskarsaikia-17/ascii-fonts/contents/fonts');
        if (!response.ok) {
            throw new Error('Failed to fetch fonts');
        }
        const fonts = await response.json();
        return fonts.map(font => font.name.replace('.flf', ''));
    } catch (error) {
        console.error('Error fetching fonts:', error.message);
        return [];
    }
}

async function populateFontDropdown() {
    const fontSelect = document.getElementById('fontSelect');
    const fontList = await fetchFontNames();
    
    // Sort fonts alphabetically
    fontList.sort();
    
    // Add loading animation
    fontSelect.innerHTML = '<option value="">Loading fonts...</option>';
    
    // Populate the dropdown with a subtle animation
    setTimeout(() => {
        fontSelect.innerHTML = '<option value="Standard">Standard</option>';
        
        fontList.forEach((font, index) => {
            setTimeout(() => {
                const option = document.createElement('option');
                option.textContent = font;
                option.value = font;
                // Add data attribute for better styling control
                option.setAttribute('data-font-name', font);
                fontSelect.appendChild(option);
            }, index * 5); // Staggered loading for smooth appearance
        });
    }, 300);
}

function generateASCII() {
    const inputText = document.getElementById("textInput").value.trim();
    const inputLength = inputText.length;

    // Add loading animation
    const asciiOutput = document.getElementById("asciiOutput");
    asciiOutput.innerHTML = '<div class="has-text-centered"><span class="icon is-large"><i class="fas fa-spinner fa-2x"></i></span><p>Generating art...</p></div>';
    asciiOutput.style.display = "block";

    setTimeout(() => {
        if (inputLength < 2) {
            showNotificationModal('ERROR: Text must be at least 2 characters long.');
            asciiOutput.innerHTML = '';
            return;
        } else if (inputLength > 40) {
            showNotificationModal('ERROR: Text must not exceed 40 characters.');
            asciiOutput.innerHTML = '';
            return;
        }

        const selectedFont = document.getElementById("fontSelect").value;
        const artType = document.getElementById("artType").value;

        if (artType === 'figlet') {
            figlet(inputText, { font: selectedFont }, function(err, figletData) {
                if (err) {
                    console.error('Error generating Figlet ASCII art:', err);
                    asciiOutput.innerText = 'Error: Failed to generate ASCII art';
                    return;
                }

                if (figletData.trim()) {
                    asciiOutput.innerHTML = `<section class="section"><div class="container content"><div class="columns is-centered"><div class="column is-full"><section id="terminal__bar">
                <div class="fakeButtons fakeClose"></div>
                <div class="fakeButtons fakeMinimize"></div>
                <div class="fakeButtons fakeZoom"></div>
                </section><pre>${figletData}</pre>`;
                }

                createButtonContainer(asciiOutput);
            });
        } else if (artType === 'cowsay') {
            const cowsayData = `
  __________________
  < ${inputText} >
  ------------------
         \\   ^__^
          \\  (oo)\\_______
             (__)\\       )\\/\\
                 ||----w |
                 ||     ||
`;
            asciiOutput.innerHTML = `<section class="section"><div class="container content"><div class="columns is-centered"><div class="column is-full"><section id="terminal__bar">
            <div class="fakeButtons fakeClose"></div>
            <div class="fakeButtons fakeMinimize"></div>
            <div class="fakeButtons fakeZoom"></div>
            </section><pre>${cowsayData}</pre>`;

            createButtonContainer(asciiOutput);
        }
    }, 800); // Simulate processing time for better UX
}

// Helper function to create button container
function createButtonContainer(parentElement) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'has-text-centered mt-4';
    parentElement.appendChild(buttonContainer);

    // Clear button
    const clearButton = document.createElement('button');
    clearButton.innerHTML = '<span class="icon"><i class="fas fa-trash-alt"></i></span><span class="button-text">Clear</span>';
    clearButton.className = 'button is-danger mr-2';
    clearButton.onclick = clearText;
    
    // Copy button
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '<span class="icon"><i class="fas fa-copy"></i></span><span class="button-text">Copy</span>';
    copyButton.className = 'button is-info';
    copyButton.onclick = copyToClipboard;
    
    // Add buttons with staggered animation
    setTimeout(() => buttonContainer.appendChild(clearButton), 100);
    setTimeout(() => buttonContainer.appendChild(copyButton), 200);
}

function clearText() {
    document.getElementById("textInput").value = "";
    
    // Add fade-out animation
    const asciiOutput = document.getElementById("asciiOutput");
    asciiOutput.style.opacity = "0";
    
    setTimeout(() => {
        asciiOutput.innerText = "";
        document.getElementById("fontSelect").value = "Standard";
        asciiOutput.style.display = "none";
        asciiOutput.style.opacity = "1";
    }, 300);
}

// Initialize font dropdown on page load
document.addEventListener('DOMContentLoaded', () => {
    populateFontDropdown();
    
    // Add entrance animation for the main card
    const mainCard = document.querySelector('.card');
    mainCard.style.opacity = '0';
    mainCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        mainCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        mainCard.style.opacity = '1';
        mainCard.style.transform = 'translateY(0)';
    }, 100);
});

async function copyToClipboard() {
    const asciiOutput = document.getElementById("asciiOutput");
    const preElement = asciiOutput.querySelector('pre');
    
    if (!preElement) return;
    
    const asciiText = preElement.innerText;

    try {
        await navigator.clipboard.writeText(asciiText);
        
        // Create and show temporary success indicator
        const success = document.createElement('div');
        success.className = 'notification is-success is-light';
        success.style.position = 'fixed';
        success.style.bottom = '20px';
        success.style.right = '20px';
        success.style.padding = '10px 15px';
        success.style.borderRadius = '4px';
        success.style.boxShadow = '0 3px 10px rgba(0,0,0,0.1)';
        success.style.zIndex = '1000';
        success.style.animation = 'slideIn 0.3s ease';
        success.innerHTML = '<span class="icon"><i class="fas fa-check"></i></span> Copied to clipboard!';
        
        document.body.appendChild(success);
        
        setTimeout(() => {
            success.style.animation = 'fadeIn 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(success);
            }, 300);
        }, 2000);
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showNotificationModal('Failed to copy ASCII art to clipboard');
    }
}

function toggleFontSelect() {
    const artType = document.getElementById("artType").value;
    const fontField = document.getElementById("fontField");

    if (artType === "figlet") {
        fontField.style.display = "block";
    } else {
        fontField.style.display = "none";
    }
    
    // Highlight the selected option
    const select = document.getElementById("artType");
    select.classList.add("is-focused");
    setTimeout(() => {
        select.classList.remove("is-focused");
    }, 1000);
}