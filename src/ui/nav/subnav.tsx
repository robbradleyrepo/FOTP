import { SubNavItem } from "../modules/subnav";

const SubNavs: {
  items: SubNavItem[];
  predicate: (path: string, items: SubNavItem[]) => boolean;
}[] = [
  // Collections
  {
    items: [
      {
        key: "common:subnavigation.collections.all",
        path: "/products",
      },
      {
        key: "common:subnavigation.collections.food",
        path: "/food",
      },
      {
        key: "common:subnavigation.collections.supplements",
        path: "/collections/supplements",
      },
      {
        key: "common:subnavigation.collections.treats",
        path: "/collections/treats",
      },
    ],
    predicate: (pathname, items) =>
      items.some((item) => pathname === "/food" || item.path === pathname),
  },
  // Science
  {
    items: [
      {
        key: "common:subnavigation.science.approach",
        path: "/science",
      },
      {
        key: "common:subnavigation.science.ingredients",
        path: "/science/ingredients",
      },
      {
        key: "common:subnavigation.science.experts",
        path: "/science/experts",
      },
      {
        key: "common:subnavigation.science.evidence",
        path: "/science/evidence",
      },
      {
        key: "common:subnavigation.science.testing",
        path: "/science/testing-and-transparency",
      },
    ],
    predicate: (pathname) =>
      pathname === "/science" || pathname.startsWith("/science/"),
  },
];

export default SubNavs;
