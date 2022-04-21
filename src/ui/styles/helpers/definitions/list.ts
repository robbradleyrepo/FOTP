import factory, { StyleHelperProps } from "../factory";

type ListStyleKeys = "_listStyle" | "_listStyleImage" | "_listStyleType";

export type ListProps = StyleHelperProps<ListStyleKeys>;

const list = factory<ListStyleKeys>([
  { prop: "_listStyle", properties: ["listStyle"] },
  { prop: "_listStyleImage", properties: ["listStyleImage"] },
  { prop: "_listStyleType", properties: ["listStyleType"] },
]);

export default list;
