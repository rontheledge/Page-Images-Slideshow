
function closeSlideshow() {
  const slideshow = document.getElementById('slideshow');
  if (slideshow) {
    document.body.removeChild(slideshow);
  }
  // Remove keydown event listener
  document.removeEventListener('keydown', handleKeydown);
}


function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeSlideshow();
    clearInterval(slideshowInterval);
  } else if (event.key === 'ArrowLeft') {
    changeSlide(-1);
  } else if (event.key === 'ArrowRight') {
    changeSlide(1);
  }
}

let slideshowInterval;
function createSlideshow(images) {
  const slideshow = document.createElement('div');
  slideshow.id = 'slideshow';
  slideshow.innerHTML = `
    <div class="slideshow-container">
      <a class="prev">&#10094;</a>
      <a class="next">&#10095;</a>
    </div>
  `;

  const prevButton = slideshow.querySelector('.prev');
  const nextButton = slideshow.querySelector('.next');

  prevButton.addEventListener('click', () => changeSlide(-1));
  nextButton.addEventListener('click', () => changeSlide(1));

  document.body.appendChild(slideshow);
  return slideshow.querySelector('.slideshow-container');
}

function changeSlide(direction) {
  const slides = document.getElementsByClassName('slide');
  let currentIndex = 0;

  for (let i = 0; i < slides.length; i++) {
    if (slides[i].style.display === 'block') {
      currentIndex = i;
      break;
    }
  }

  const newIndex = currentIndex + direction;
  if (newIndex >= 0 && newIndex < slides.length) {
    slides[currentIndex].style.display = 'none';
    slides[newIndex].style.display = 'block';
  }
}

function startSlideshow() {
	 // Check if the slideshow is already active
  if (document.getElementById('slideshow')) {
    return;
  }
  const images = Array.from(document.images).map(img => img.src);
	if(!images.length) {
	alert('No images found on this page');
	}
  const slideImages = images.map(src => {
    const slide = document.createElement('img');
    slide.className = 'slide';
    slide.src = src;
    slide.style.display = 'none';
    return slide;
  });

  const slideshowContainer = createSlideshow(slideImages);

  // Add slide images to the slideshow container
  slideImages.forEach(slide => {
    slideshowContainer.appendChild(slide);
  });

  // Display the first image
  slideImages[0].style.display = 'block';

  let index = 0;
  setInterval(() => {
    changeSlide(1);
    index = (index + 1) % slideImages.length;
  }, 2000);
	// Listen for Escape key press
  document.addEventListener('keydown', handleKeydown);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startSlideshow') {
    startSlideshow();
  }
});
