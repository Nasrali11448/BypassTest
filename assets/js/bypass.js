const inputLink = document.getElementById('bypassInput');
const submitButton = document.getElementById('submitButton');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const popupBody = document.getElementById('popup-body');
const closePopup = document.getElementById('closePopup');
const copyContent = document.getElementById('copyContent');
const openLink = document.getElementById('openLink');
const bypassInput = document.getElementById('bypassInput');

/* Helper functions */
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/* Bypass listeners */
closePopup.addEventListener('click', hidePopup);
overlay.addEventListener('click', hidePopup);
copyContent.addEventListener('click', copyPopupContent);
openLink.addEventListener('click', openPopupLink);

/* Input validation */
submitButton.disabled = true;
bypassInput.addEventListener('input', () => {
    submitButton.disabled = !isValidUrl(bypassInput.value.trim()) || !getRecaptcha();
});
window.addEventListener('load', () => {
    submitButton.disabled = !isValidUrl(bypassInput.value.trim());
});

/* Bypass functions */
function showPopup(content) {
    if (/^(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?$/.test(content)) {
        popupBody.innerHTML = `<a href="${content}" target="_blank">${content}</a>`;
        openLink.hidden = false;
    } else {
        popupBody.innerHTML = content.replace(/\n/g, '<br>');
        openLink.hidden = true;
    }
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function hidePopup() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

async function bypassLink(token) {
    submitButton.disabled = true;
    try {
        const response = await apiRequest(inputLink.value, token);
        if (response.status == 'success') {
            inputLink.value = null;
            showPopup(response.result);
        } else {
            showPopup(response.message);
        }
    } catch (e) {
        console.log(e);
        showPopup(e.message || 'Error contacting API, please try again later.');
    } finally {
        submitButton.disabled = !inputLink.value;
    }
}

async function apiRequest(link, token) {
    const recaptcha = getRecaptcha();
    try {
        if (!recaptcha) {
            throw new Error('reCAPTCHA not loaded. Please refresh the page.');
        }

        const response = await fetch(`https://api.bypass.vip/bypass?url=${encodeURIComponent(link)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: link,
                recaptchaToken: token
            })
        });

        return response.json();
    } catch (e) {
        throw new Error('An error occurred while contacting the API.');
    } finally {
        if (recaptcha) {
            recaptcha.reset();
        }
    }
}

/* Recaptcha getter function */
function getRecaptcha() {
    return window.grecaptcha;
}

/* Copy to clipboard */
function copyPopupContent() {
    // Get content and replace <br> tags with newlines
    const content = popupBody.innerHTML
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, ''); // Remove any other HTML tags
    
    navigator.clipboard.writeText(content).then(() => {
        const originalText = copyContent.textContent;
        copyContent.textContent = 'Copied!';
        setTimeout(() => {
            copyContent.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard');
    });
}

function openPopupLink() {
    const link = popupBody.querySelector('a');
    if (link) {
        window.open(link.href, '_blank');
    }
}
