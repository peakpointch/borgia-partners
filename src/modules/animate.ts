import { createAttribute } from '../../node_modules/peakflow/dist/attributeselector/index';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


type AnimateElement = 'heading' | 'nav-component' | 'nav-brand' | 'nav-link' | 'nav-button' | 'light-nav';
const animateSelector = createAttribute<AnimateElement>('data-animate');

export function animateHeading(element: HTMLElement): void {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  const heading = new SplitText(element, { type: 'words', wordsClass: 'gsap-word' });
  gsap.from(heading.words, {
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%', // Trigger when heading is 80% down the viewport
    },
  });
}

export function animateHeadings(): void {
  const headings = document.querySelectorAll<HTMLElement>(animateSelector('heading'));
  headings.forEach((element) => animateHeading(element));
}


export function navToLight(nav: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>): void {
  if (!nav) throw new Error(`Please pass a navbar to animate.`);
  const navComponents = nav instanceof HTMLElement ? [nav] : Array.from(nav);
  navComponents.forEach((component) => {
    gsap.to(component, {
      color: "var(--_primitives---colors--white)",
      duration: 0.2,
      ease: "power2.out"
    });

    gsap.to(animateSelector('nav-brand'), {
      filter: "invert(100%)",
      color: "var(--_primitives---colors--white)",
      duration: 0.2,
      ease: "power2.out"
    })

    gsap.to(animateSelector('nav-link'), {
      color: "var(--_primitives---colors--white)",
      duration: 0.2,
      ease: "power2.out"
    });

    gsap.to(animateSelector('nav-button'), {
      color: "var(--_primitives---colors--white)",
      borderColor: "var(--_primitives---colors--white)",
      duration: 0.2,
      ease: "power2.out"
    });
  });
}

export function navToDefault(nav: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>): void {
  if (!nav) throw new Error(`Please pass a navbar to animate.`);
  const navComponents = nav instanceof HTMLElement ? [nav] : Array.from(nav);
  navComponents.forEach((component) => {
    gsap.to(component, {
      color: "var(--_primitives---colors--brand-darkest)",
      duration: 0.2,
      ease: "power2.out"
    });

    gsap.to(animateSelector('nav-brand'), {
      filter: "invert(0%)",
      color: "var(--_primitives---colors--brand-darkest)",
      duration: 0.2,
      ease: "power2.out"
    })

    gsap.to(animateSelector('nav-link'), {
      color: "var(--_primitives---colors--brand-darkest)",
      duration: 0.2,
      ease: "power2.out"
    });

    gsap.to(animateSelector('nav-button'), {
      color: "var(--_primitives---colors--brand-darkest)",
      borderColor: "var(--_primitives---colors--brand-darkest)",
      duration: 0.2,
      ease: "power2.out"
    });
  });
}

export function initNavAnimation(): void {
  gsap.registerPlugin(ScrollTrigger);

  const navComponents = Array.from(document.querySelectorAll<HTMLElement>(animateSelector('nav-component')));
  const lightSections = Array.from(document.querySelectorAll<HTMLElement>(animateSelector('light-nav')));

  let isLight = false; // Tracks current navbar state

  lightSections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',    // when section top enters bottom of viewport
      end: 'bottom top',      // when section bottom leaves top of viewport
      onEnter: () => {
        if (!isLight) {
          navToLight(navComponents);
          isLight = true;
        }
      },
      onEnterBack: () => {
        if (!isLight) {
          navToLight(navComponents);
          isLight = true;
        }
      },
      onLeave: () => {
        // Check if we're still in *any* other light section
        const stillInLight = lightSections.some((el) => ScrollTrigger.isInViewport(el, 0));
        if (!stillInLight && isLight) {
          navToDefault(navComponents);
          isLight = false;
        }
      },
      onLeaveBack: () => {
        const stillInLight = lightSections.some((el) => ScrollTrigger.isInViewport(el, 0));
        if (!stillInLight && isLight) {
          navToDefault(navComponents);
          isLight = false;
        }
      }
    });
  });

  // ✅ Set initial nav state on load
  const anyVisible = Array.from(lightSections).some((el) =>
    ScrollTrigger.isInViewport(el, 0)
  );
  if (anyVisible) {
    navToLight(navComponents);
    isLight = true;
  } else {
    navToDefault(navComponents);
    isLight = false;
  }
}

