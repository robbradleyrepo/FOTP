import { useRouter } from "next/router";

interface NavigationData {
  children?: NavigationData[];
  key: string;
  handle: string;
}

export interface NavigationItem {
  active?: boolean;
  current?: boolean;
  key: string;
  to: string;
}

const navigationData = {
  children: [
    {
      children: [
        {
          handle: "[id]",
          key: "subscriptionDetails",
        },
      ],
      handle: "subscriptions",
      key: "subscriptions",
    },
    {
      children: [
        {
          handle: "[id]",
          key: "orderDetails",
        },
      ],
      handle: "orders",
      key: "orderHistory",
    },
    {
      children: [
        {
          handle: "change",
          key: "paymentChange",
        },
      ],
      handle: "payment",
      key: "paymentDetails",
    },
    {
      handle: "change-password",
      key: "changePassword",
    },
  ],
  handle: "account",
  key: "account",
};

const breadcrumbMapper = (
  handles: string[],
  data: NavigationData,
  prefix = ""
): NavigationItem[] => {
  const [handle, ...rest] = handles;

  // Sanity check: make sure we start the iteration with the right data
  if (data.handle !== handle) {
    throw new Error("Invalid navigation data");
  }

  const to = `${prefix}/${handle}`;

  let child: NavigationData | undefined;

  if (rest.length > 0 && data.children) {
    child = data.children.find((child) => child.handle === rest[0]);
  }

  const result = [
    {
      key: data.key,
      to,
    },
  ];

  return child ? [...result, ...breadcrumbMapper(rest, child, to)] : result;
};

export const useAccountNavigation = () => {
  const { pathname } = useRouter();

  const menuItems = navigationData.children.map(({ handle, key }) => {
    const to = `/${navigationData.handle}/${handle}`;

    const active = pathname.startsWith(to);
    const current = pathname === to;

    return {
      active,
      current,
      key,
      to,
    };
  });
  const handles = pathname
    .replace(/^\/\[region\]\/\[language\]\//, "")
    .split("/");

  const breadcrumbs = breadcrumbMapper(handles, navigationData);

  return {
    breadcrumbs,
    menuItems,
  };
};
