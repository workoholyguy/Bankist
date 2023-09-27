'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
// Select the ID not class
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
// Refactor
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Modal window
{
  /**IMPLEMENTING SMOOTH SCROLLING */

  btnScrollTo.addEventListener('click', function (e) {
    // OLD SCHOOL WAY
    // Get the Coordinates of the element to which we are going to scroll
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords); //DOMRect {x: 0, y: 487.08331298828125, width: 890.8333129882812, height: 1652.2525634765625, top: 487.08331298828125, …}
    // console.log(e.target.getBoundingClientRect()); // Button elmnt // DOMRect {x: 30, y: 447.7994689941406, width: 110, height: 27.825519561767578, top: 447.7994689941406, …}

    // CURRENT SCROLL POSITION
    // console.log('Current Scroll (X/Y)', window.pageXOffset, pageYOffset); //Current Scroll (X/Y) 0 312.6171875

    // // GET THE HEIGHT AND WIDTHS OF A VIEWPORT
    // console.log('height/width viewport',
    // document.documentElement.clientHeight,
    // document.documentElement.clientWidth,
    // );

    // SCROLLING
    // window.scrollTo(
    //   s1coords.left + window.pageXOffset,
    //   s1coords.top + window.pageYOffset
    // ); // To the top of the section 1
    // .top is relative to viewport not the whole page -- Solution is to add a Current scroll value to the .top value
    // Current Scroll value -- distance between the top of the page and the top of a view port

    // IMPROVMENT
    // window.scrollTo({
    //   left: s1coords.left + window.pageXOffset,
    //   top: s1coords.top + window.pageYOffset,
    //   behavior: 'smooth',
    // })

    //MODERN WAY
    section1.scrollIntoView({
      behavior: 'smooth',
    });
  });
  /**IMPLEMENTING SMOOTH SCROLLING */
}

{
  /**EVENT DELEGATION: IMPLEMENTING PAGE NAVIAGATION */
  // Will return a node List

  // ATTACHING EVENT LISTENER TO EACH NAC LINK
  // document.querySelectorAll('.nav__link').forEach(function(el){
  //   el.addEventListener('click', function(e){
  //     e.preventDefault()
  //     // console.log('LINK');
  //     // SMOOTH SCROLLING
  //     const id = this.getAttribute('href')
  //     console.log(id);
  //     document.querySelector(id).scrollIntoView({
  //       behavior: 'smooth'
  //     })
  //   })
  // })

  //ATTACHING EVENT LISTENER TO A PARENT ELEMENT -- EVENT DELEGATION
  // 1. Add Event listener to a common parent element
  document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    // 2. Determine which event originated the event
    // console.log(e.target);
    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
      // console.log('LINK');
      const id = e.target.getAttribute('href');
      console.log(id);
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
      });
    }
  });

  /**EVENT DELEGATION: IMPLEMENTING PAGE NAVIAGATION */
}

{
  /**BUILDING TABBED COMPONENT */

  // Selection tabs
  const tabs = document.querySelectorAll('.operations__tab');
  const tabsContainer = document.querySelector('.operations__tab-container');
  const tabsContent = document.querySelectorAll('.operations__content');

  // Adding eventHandlers to each button
  // Bad Practice
  // tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));
  // Refactor by using Event Delegation
  tabsContainer.addEventListener('click', function (e) {
    // Matching
    // Figure out which button is clicked
    const clicked = e.target.closest('.operations__tab'); //"target" is a keyword which points to an element that triggered the event

    // Make sure we select the whole button element even when we click on <span> element, here "01", "02", "03" --- use "closest()"

    console.log(clicked);

    // Igonre any "non-tab" clicks, which return null, bcs when we click on a container it cannot find any elements with class ".operations__tab" through "closest()" method
    // Use Guard clause
    if (!clicked) return;

    //Make the tabs that are not selected move down
    tabs.forEach(t => t.classList.remove('operations__tab--active'));

    // Deactivate the content of the tab that is not selected
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    // Move the selected(active) tab up
    clicked.classList.add('operations__tab--active');

    // Active Content Area
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });

  /**BUILDING TABBED COMPONENT */
}

{
  /**FADING OUT ALL OF THE LINKS */
  // Find common Parent Element of all of the links AND the logo its '.nav' stored in "nav" var
  // "mouseover" event is similar to "mouseenter" (both are for hovering) except "mouseover" bubbles up
  // Note; opposite of "mouseenter" -- '"mouseleave", opposite of "mouseover" -- "mouse out"
  // Refactor 1.0
  const handleHover = function (e) {
    // console.log(e.currentTarget);
    // Itentify the link that has been hovered over
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      // Now select all the other links by going to a common parent
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(el => {
        // Exclude the link that is currently being hovered over (target)
        if (el !== link) el.style.opacity = this;
      });
      // Do the Same for a logo
      logo.style.opacity = this;
    }
  };

  // Hover Over
  // Refactor 2.0
  // Bind -- creates a copy of a method that it's called on, and sets "this" keyword to whatever value we pass in bind
  nav.addEventListener('mouseover', handleHover.bind(0.5));

  // Hover Out
  nav.addEventListener('mouseout', handleHover.bind(1));

  // TAKAWAYS -- EventListener expect a function as a second parameter (not a function call) --> therefore we use "bind" which returns a function, without calling it
  // Bind sets the "this" in the function to which it's bound to the paramter that has been passed into bind. For e.x. handleHover.bind(0.5) --> this of "handleHover()" = 0.5
  // this keyword is normally equal to a currentTarget. when we set "this" manually the value of 'currentTarget' remains the same

  /**FADING OUT ALL OF THE LINKS */
}

{
  /**STICKY NAVIGATION BAR -- MODERN APPROACH */
  //USE "INTERSECTION OF SERVER API" -- allows to observe changes until certain element, intersect another element

  // Will be called everytime the target/oberved element intersects the root element at threshold 0.1 (or 10%) (when we scroll up or down)
  // Note: (entries, observer) are default parameters that are going to be passed into any callBack function, here "obsCallback"
  // Note: entries -- array of threshold entries
  // const obsCallback = function (entries, observer) {
  //   entries.forEach(entry => {
  //     console.log(entry);
  //   })
  // };

  // const obsOptions = {
  //   // Requirement -- root = element that the target is intersecting
  //   // when root: null - the oberver observes for target element to intersect the viewport
  //   root: null,
  //   threshold: [0, 0.2], // Trigger the callback when the target is completely out of view(0%), and when the target is 20% in the view
  // };

  // const observer = new IntersectionObserver(obsCallback, obsOptions);
  // observer.observe(section1); // Observing Section1

  // Display the sticky Navigation when the header element is out of view
  // Observe the header
  const header = document.querySelector('.header');
  const navHeight = nav.getBoundingClientRect().height;

  const stickyNav = function (entries, oberver) {
    const [entry] = entries; //Destructuring = entry = entries[0]
    // console.log(entry);
    // console.log(entries);

    //Add sticky class only when the header is not intersecting the viewport
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };
  const headerObserver = new IntersectionObserver(
    stickyNav,
    // Specify the Intersection Info
    {
      root: null,
      threshold: 0,
      rootMargin: `-${navHeight}px`, // Review -- Always specify with pixels
    }
  );

  // .observer is a method
  headerObserver.observe(header);

  /**STICKY NAVIGATION BAR -- MODERN APPROACH */
}

/**STICKY NAVIGATION BAR -- POOR PERFORMANCE*
// 1. Determine the top of the section 1 
const initialCoords = section1.getBoundingClientRect()
console.log(initialCoords);//DOMRect {x: 0, y: -99.62239074707031, width: 797.5, height: 1804.2056884765625, top: -99.62239074707031, …}

// Implement by using scroll Event -- POOR PERFORMANCE, bcs eventListener fires for each scroll
window.addEventListener('scroll', function(){
  // console.log(window.scrollY); //ScrollY - is a distance from the top of a viewPort, to the top of the page
  // WE WANT THE STICKY SCROLLING TO START FROM THE TOP OF THE 1ST SECTION
  // console.log(window.scrollY, initialCoords.top);
  // Add the sticky class
  if(this.window.scrollY > initialCoords.top) nav.classList.add('sticky') 
  else nav.classList.remove('sticky')
  // Remove the sticky class otherwise
})


/**STICKY NAVIGATION BAR -- POOR PERFORMANCE*/

{
  /**REVEALING ELEMENTS ON SCROLL */
  // 1. Hide all of the sections
  // 2. Remove the hidden class as we approach each section
  const allSections = document.querySelectorAll('.section');
  const revealSection = function (entries, observer) {
    const [entry] = entries;
    // console.log(entry);

    if (!entry.isIntersecting) return; //Guard clause to execute the logic only when the section is intersecting
    entry.target.classList.remove('section--hidden');

    // Unobesrve after the revealing is complete
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null, // root is a viewport
    threshold: 0.15, //15%
  });

  allSections.forEach(section => {
    sectionObserver.observe(section);
    // section.classList.add('section--hidden') //Note "hidden" class shifts the elements 8 rem down
  });

  /**REVEALING ELEMENTS ON SCROLL */
}

{
  /**LAZY LOADING IMAGES */

  // Select image with and attribute "data-src" --> bcs those are the only ones to be lazyloaded
  const imgTargets = document.querySelectorAll('img[data-src]');
  // console.log(imgTargets); //NodeList(3) [img.features__img.lazy-img, img.features__img.lazy-img, img.features__img.lazy-img]
  // imgTargets.forEach(el => console.log(el))
  const loadImg = function (entries, observer) {
    const [entry] = entries; //We only have 1 threshold === 1 entry
    // console.log(entry);

    if (!entry.isIntersecting) return;

    // Actual Functionality: if we intersect the image ---> replace src with data-src
    entry.target.src = entry.target.dataset.src;
    // entry.target.classList.remove('lazy-img')

    // Remove the blury filter
    entry.target.addEventListener('load', function (e) {
      // Remove the blury filter only after the full size image is completely loaded
      entry.target.classList.remove('lazy-img');
    });

    // Stop Observing after the work is done
    observer.unobserve(entry.target);
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    // To start the call back function before than we reach the image, so the user doesn't notice the lazy loading, we can specify the rootMargin
    rootMargin: '200px', //Images load 200 pixels before we reach the image.
  });

  // Attach an observe to each image
  imgTargets.forEach(img => imgObserver.observe(img));

  /**LAZY LOADING IMAGES */
}

/**BUILDING A SLIDER COMPONENT */

// PART 1 *****************************************************************

// SLider
const slider = function(){

  const slides = document.querySelectorAll('.slide');
  const maxSlide = slides.length - 1;
  
  // Temporarily scale down the slider
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.35) translateX(-800px)';
  // slider.style.overflow = 'visible';
  
  // Select the buttons
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  
  // Keep Track of a current Slide
  let curSlide = 0;
  
  // FUNCTIONS
  // Refactor Slide Translation
  // Loop through the slides and set the style for each
  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  
  // a function to move to the next slide
  const nextSlide = function () {
    // Set a boundary so when we are at the last slide we stop sliding
    if (curSlide === maxSlide) {
      curSlide = 0;
    }
    // Set the value of a currentSLide everytime we click "btnRight"
    else {
      curSlide++;
    }
  
    // // Change thepostions of each slide
    // Refactored
    goToSlide(curSlide);
    // slides.forEach(
    //   // s = slide, i = index
    //   (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
    // );
    // Activate the dot
    activateDot(curSlide);
  };
  
  // a function to move to the prevous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    // Activate the dot
    activateDot(curSlide);
  };
  
  // Add the dots --> dotContainer
  // Create dots
  const createDots = function () {
    // "_" - is pointing to slides, "i" points at the index of each slide
    slides.forEach(function (_, i) {
      // "beforeend" -- adding html as a last chaild always
      dotContainer.insertAdjacentHTML(
        'beforeend',
        // Inserting HTML for dots
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  
  // Activate the dot that has been clicked
  const activateDot = function (slide) {
    // 1. Deactivate all of the dots
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
  
    // Now add the active class to the dot that has been selected
    // Based on data-slide attribute
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  
  // INITIALIZATION FUNCTION
  const init = function () {
    //At the begging of the code set the function value to 0, to start with the 1st slide
    goToSlide(0);
    // Create the dots
    createDots();
    // Activate the dot at the beggining of the code
    activateDot(0);
  
  };
  init();
  
  // EVENT HANDLERS
  // DEFINING LOGIC OF THE RIGHT BUTTON
  btnRight.addEventListener('click', nextSlide);
  
  // DEFINING LOGIC OF THE LEFT BUTTON
  btnLeft.addEventListener('click', prevSlide);
  
  // PART 2 *****************************************************************
  // Slide through slides using left and right key arrows
  document.addEventListener('keydown', function (e) {
    console.log(e);
    // if key that is pressed is equal to ArrowRight or ArrowLeft --> change the slide
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });
  
  
  // CODING LOGIC OF DOTS
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      console.log(e);
      // const slide = e.target.dataset.slide
      // Or Destructure the object instead
      const { slide } = e.target.dataset;
      // Now go to the slide that has been selected
      goToSlide(`${slide}`);
  
      // Activate the dot
      activateDot(slide);
    }
  });
}
slider()

/**BUILDING A SLIDER COMPONENT */

/**DOM TRAVERSING *
const h1 = document.querySelector('h1')

// GOING DOWNWARDS: CHILD
console.log(h1.querySelectorAll('.highlight')); //NodeList(2) [span.highlight, span.highlight]

// Selecting direct children only
console.log(h1.childNodes); //NodeList(9) [text, comment, text, span.highlight, text, br, text, span.highlight, text]

// Selcting all of the DIRECT children 
console.log(h1.children); //HTMLCollection(3) [span.highlight, br, span.highlight]

h1.firstElementChild.style.color = 'white' // Changes the color of the word "banking"

h1.lastElementChild.style.color = 'orangered' // Changes the color of the word "minimalist"

// GOING UPWARDS: PARENTS

// For direct parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// Finding direct parent element no matter how far it is in the DOM TREE
// Selecting the closest parent element that has "header" class
h1.closest('.header').style.background = 'var(--gradient-secondary)'

h1.closest('h1').style.background = 'var(--gradient-primary)'

// While querySelector() selects the children no matter how deep they are in the dom tree, closest() selects any parent no matter how far they are up the tree

// GOING SIDEWAYS: SIBLINGS
// We can only access direct siblings (previous and next)
console.log(h1.previousElementSibling); //null
console.log(h1.nextElementSibling); //<h4>A simpler banking experience for a simpler life.</h4>

console.log(h1.previousSibling); //#text
console.log(h1.nextSibling); //#text

// To select all of the children we move up once to a parent element and then select all of the children 
console.log(h1.parentElement.children); // Returns all of the siblings including itself (h1)

// Scale all of the childrien except itself
[...h1.parentElement.children].forEach(function(el){
  if(el !==h1) el.style.transform = 'scale(0.5)'
})


/**DOM TRAVERSING */

/**SELECTING CREATING, AND DELETING ELEMENTS *
// SELECTING ELEMENTS
console.log(document.documentElement); //Selecting the whole HTML
console.log(document.head); //Select the Head of HTML (Note: Head is different from header in HTML -- head holds formatting info, whereas header holds actuall elemeents on top of the page that are to be displayed)
console.log(document.body); //Select Body

const header = document.querySelector('.header');
// Selecting Multipple Elements -- Returns nodeList
const allSections = document.querySelectorAll('.section');

console.log(allSections); //NodeList(4) [section#section--1.section, section#section--2.section, section#section--3.section, section.section.section--sign-up]

// Select ID needs no selector such as " # "
document.getElementById('section--1');

// Selecting By Tag Retruns HTML Collection also updates dynamically
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); //HTMLCollection(9) [button.btn--text.btn--scroll-to, button.btn.operations__tab.operations__tab--1.operations__tab--active, button.btn.operations__tab.operations__tab--2, button.btn.operations__tab.operations__tab--3, button.slider__btn.slider__btn--left, button.slider__btn.slider__btn--right, button.btn.btn--show-modal, button.btn--close-modal, button.btn]

// Have the Same Features as SelectByTag
console.log(document.getElementsByClassName('btn')); //HTMLCollection(5) [button.btn.operations__tab.operations__tab--1.operations__tab--active, button.btn.operations__tab.operations__tab--2, button.btn.operations__tab.operations__tab--3, button.btn.btn--show-modal, button.btn]

//CREATING AND INSERTING ELEMENTS
// .insertAdjacentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent = 'We use cokies for Improvied Functionality and Analytics';
message.innerHTML =
  'We use cokies for Improvied Functionality and Analytics <button class="btn btn--close--cookie">Got It!</button>';

// Insert into DOM
// Insert at the top of the header
// header.prepend(message)

// Insert at the bottom of the header
header.append(message);

// If we want to insert multiple copies of the same Element:
// header.append(message.cloneNode(true))

// Insert appended or prepended element before or after the header
// header.before(message)
header.after(message);

// DELETE ELEMENTS
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove();
    // Old way
    // message.parentElement.removeChild(message)
  });

/**SELECTING CREATING, AND DELETING ELEMENTS */

/**STYLES, ATTRIBUTES, CLASSES *
// STYLES
// Set a Style (Inline Styles -- Inserted Directly into DOM)
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// console.log(message.style.height); // Display Nothing as we didn't set this property in our JS, but rather in Stylesheet

console.log(message.style.backgroundColor); //rgb(55, 56, 61) | Works bcs we set this manually within this code (ln 95)

// How to get styles that are set in the styleSheet
console.log(getComputedStyle(message).color); //rgb(187, 187, 187)
console.log(getComputedStyle(message).height); //49.1667px

// Now we can manipulate Stylesheet properties
// getComputedStyle -- Returns string --> we need to parse it into a number
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
// Number.parseFloat(value to be parsed, base)
console.log(getComputedStyle(message).height); //79.1667px

// CSS CUSTOM PROPERTIES / VARIABLES 

// Changing primary color used on a page
document.documentElement.style.setProperty('--color-primary', 'orangered')
// Variables that could be changed
// --color-primary: #5ec576;
//   --color-secondary: #ffcb03;
//   --color-tertiary: #ff585f;
//   --color-primary-darker: #4bbb7d;
//   --color-secondary-darker: #ffbb00;
//   --color-tertiary-darker: #fd424b;
//   --color-primary-opacity: #5ec5763a;
//   --color-secondary-opacity: #ffcd0331;
//   --color-tertiary-opacity: #ff58602d;
//   --gradient-primary: linear-gradient(to top left, #39b385, #9be15d);
//   --gradient-secondary: linear-gradient(to top left, #ffb003, #ffcb03);

// HTML ATTRIBUTES
// Attributes of any element(here, 'img') are:
// <img
// src="img/logo.png"
// alt="Bankist logo"
// class="nav__logo"
// id="logo"
// /> 


const logo = document.querySelector('.nav__logo')

// READ ATTRIBUTE VALUES
console.log(logo.alt);//Bankist logo 
//  == console.log(document.querySelector('.nav__logo').alt);
console.log(logo.src); //http://127.0.0.1:5500/JAVA%20SCRIPT/complete-javascript-course-master/13-Advanced-DOM-Bankist/starter/img/logo.png
console.log(logo.className);//nav__logo

// Getting Attributes on method above only works bcs "alt" and "src" atributes are supposed to be in the img element
// Below I'm trying to read the value of img element's designer property that is not standard
console.log(logo.designer);//undefined
// WorkAround
console.log(logo.getAttribute('designer'));//Jonas

// To get relative path of img URL
// Absolute path
console.log(logo.src);//http://127.0.0.1:5500/JAVA%20SCRIPT/complete-javascript-course-master/13-Advanced-DOM-Bankist/starter/img/logo.png

// Relative Path
console.log(logo.getAttribute('src'))//img/logo.png

const link = document.querySelector('.nav__link--btn')
console.log(link.href);//http://127.0.0.1:5500/JAVA%20SCRIPT/complete-javascript-course-master/13-Advanced-DOM-Bankist/starter/index.html?#
console.log(link.getAttribute('href'));//#

//CHANGE/SET ATTRIBUTE VALUES
logo.alt ='Beautiful Minimalist logo'
console.log(logo.alt);//Beautiful Minimalist logo

//ADD/SET ATTRIBUTE VALUES
logo.setAttribute('company', 'Bankist')
console.log(logo.getAttribute('company')); // Bankist

//DATA ATTRIBUTES
// Although in the html the atribute name is "data-version-number="3.0"", in the JS we must use Camel Case for 'versionNumber'
console.log(logo.dataset.versionNumber);//3.0

// CLASSES
logo.classList.add('c', 'j') // Adding multiple Classes
logo.classList.remove('c', 'j')
logo.classList.toggle('c')
logo.classList.contains('c')

// Adding/Setting ClassName. NOTE: DO NOT USE IT -- bcs it will overwrite all of the existing classes
logo.className = 'jonas'

/**STYLES, ATTRIBUTES, CLASSES */

/**TYPES OF EVENTS AND EVENT HANDLERS *

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');

  // Remove Event Listener --- to be able to listen to event only once
  // h1.removeEventListener('mouseenter', alertH1)
}
// MOUSE ENTER EVENT - HOVER
h1.addEventListener('mouseenter', alertH1);

// Removing Event Listener after 3 seconds after event happened 
setTimeout(() => h1.removeEventListener('mouseenter',alertH1), 3000)


// Refactor -- OlD SCHOOL BELOW
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };

/**TYPES OF EVENTS AND EVENT HANDLERS */

/** EVENT PROPAGATION: BUBBLING AND CAPTURING*

// rgb(255,255,255)
// Range Random Number generator
const randomInt = (min, max) =>
  Math.floor(min + Math.random() * (max - min + 1));

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

console.log(randomColor());

//ATTACHING RANDOM COLOR TO A "FEATURES" LINK AND THEN TO ALL OF IT'S PARENT ELEMENTS
// FEATURES LINK
document.querySelector('.nav__link').addEventListener('click', function(e){
  // console.log(`LINK`);
  this.style.backgroundColor = randomColor()
  console.log('LINK', e.target, e.currentTarget);
  // "THIS" KEYWORD WILL ALWAYS BE THE SAME AS "currentTarget", not global target(which is features link)
  console.log(e.currentTarget === this);//true 

  //STOP EVENT PROPAGATION -- NOW PARENT ELEMENTS WON'T CHANGE THEIR BACKGROUND COLORS 
  // e.stopPropagation()
})

// NAVIGATION BAR
document.querySelector('.nav__links').addEventListener('click', function(e){
  // console.log(`LINK`);
  this.style.backgroundColor = randomColor()
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(e.currentTarget === this);//true 

})

document.querySelector('.nav').addEventListener('click', function(e){
  // console.log(`LINK`);
  this.style.backgroundColor = randomColor()
  console.log('NAV', e.target, e.currentTarget);
  console.log(e.currentTarget === this);//true 

  // THIRD PARMETER OF "addEventListener" defines wehther the AEL should listen for the event in the capturing phase, which happens before bubbling phase. 
  // By default is set to false
  // Below we set it to "true", as a result "NAV" AddEventL is executed first, i.e. executed before actuall target (here, "features" Link)
}, true)

/** EVENT PROPAGATION: BUBBLING AND CAPTURING*/

/**LIFECYCLE DOM EVENTS *
// DOM CONTENT LOADED - Fired when the html is completely parsed(Downloaded and converted into a DOM tree.).

document.addEventListener('DOMContentLoaded', function(e){
  console.log("HTML Parsed and DOM tree build", e);//Event {isTrusted: true, type: 'DOMContentLoaded', target: document, currentTarget: document, eventPhase: 2, …}
})

// LOAD EVENT - Fired by the window, when all of the images and external resourses are loaded along with HTML
window.addEventListener('load', function(e){
  console.log('Page Fully Loaded', e);//Event {isTrusted: true, type: 'load', target: document, currentTarget: Window, eventPhase: 2, …}
})

//BEFORE UNLOAD - is fired immidiately before as the user is going to leave the page (e.x. after clicking "exit" button)
window.addEventListener('beforeunload', function(e){
  // for some browsers we need to overight the default settings 
  e.preventDefault()
  console.log(e);
  // In order to display leaving confiramtion we must set "retrunValue" to empty string
  // e.returnValue = 'message'
})

/**LIFECYCLE DOM EVENTS */

/**EFFICIENT SCRIPT LOADING: DEFER AND ASYNC */
// REGULAR
// ASYNC
// DEFER
/**EFFICIENT SCRIPT LOADING: DEFER AND ASYNC */