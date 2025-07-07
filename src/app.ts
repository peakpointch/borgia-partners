import { onReady } from "@xatom/core";
import { initCardsAndLinks } from "borgia/hscroll";
import { animateHeadings, initNavAnimation } from "borgia/animate";

onReady(() => {
  console.log("WASSUUPPPP")
  initCardsAndLinks();
  animateHeadings();
  initNavAnimation();
});

