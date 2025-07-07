import { WFRoute } from "@xatom/core";
import { initCardsAndLinks } from "../modules/hscroll";

export const helloWorldRoutes = () => {
  new WFRoute("/").execute(initCardsAndLinks);
};
