import { createAttribute } from '../../node_modules/peakflow/dist/attributeselector/index';
import { gsap } from 'gsap';

type HScrollElement = 'section' | 'sticky' | 'wrapper' | 'content';
const scrollSelector = createAttribute<HScrollElement>('data-hscroll-element');

function select(element: HScrollElement): HTMLElement {
  const selector = scrollSelector(element);
  return element === 'section'
    ? document.querySelector(selector)
    : document.querySelector(scrollSelector('section')).querySelector(selector);
}

function selectAll(element: HScrollElement): HTMLElement[] {
  const selector = scrollSelector(element);
  const selected = element === 'section'
    ? document.querySelectorAll<HTMLElement>(selector)
    : document.querySelector(scrollSelector('section')).querySelectorAll<HTMLElement>(selector);

  return Array.from(selected);
}

export function initCardsAndLinks(): void {
  const cards = document.querySelectorAll('[data-problem-card]');
  const links = document.querySelectorAll('[data-problem-link]');

  // Store intersecting cards
  const visibleCards = new Set<Element>();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleCards.add(entry.target);
      } else {
        visibleCards.delete(entry.target);
      }
    });

    if (visibleCards.size === 0) {
      // No cards are intersecting
      links.forEach((link) =>
        gsap.to(link, {
          opacity: 0.25,
          duration: 0.3,
          overwrite: 'auto',
        })
      );
    } else {
      const index = Array.from(cards).findIndex(card => visibleCards.has(card));

      links.forEach((link, i) =>
        gsap.to(link, {
          opacity: i === index ? 1 : 0.25,
          duration: 0.3,
          overwrite: 'auto',
        })
      );
    }
  }, {
    threshold: 0.5,
  });

  cards.forEach((card) => observer.observe(card));
}

