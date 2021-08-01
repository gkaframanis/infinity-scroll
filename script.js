const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

import {UNSPLASH_ACCESS_KEY} from "./env.js";
// Unsplash API
const count = 5;
// Get the Unsplash access key from https://unsplash.com/.
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_ACCESS_KEY}&count=${count}`;

// Check if an image was loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        count = 30;
        apiUrl = `https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_ACCESS_KEY}&count=${count}`;

    }
};


// Helper Function to set attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
};

// Create Elements for links & photos, add to DOM.
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;

    photosArray.forEach(photo => {
        // Create <a> to link to unsplash
        const item = document.createElement("a");
        setAttributes(item, {href: photo.links.html, target: "_blank"});
        // Create <img> for photo
        const img = document.createElement("img");
        setAttributes(img, {src: photo.urls.regular, alt: photo.alt_description, title: "photo.alt_description"});
        // Event Listener, check when each is finished loading
        img.addEventListener("load", imageLoaded);
        // Put <img> inside <a>, the put both inside the imageContainer element.
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
};


// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
    } catch(error) {
        // Catch Error Here
    }
};

// Check to see if scrolling near bottom of page to load more photos.
window.addEventListener('scroll', () => {
    // innerHeight: Total height of browser window, scrollY: distance from top of page user has scrolled
    // offsetHeight: height of everything in the body, including what is not within view.
    // 1000 the value we need to subtract from offsetHeight, to trigger event before bottom is reached.
    if (window.innerHeight  + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
});

// On Load
getPhotos();
