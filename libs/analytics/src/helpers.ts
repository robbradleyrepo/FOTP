export const gidToId = (gid: string) => {
  const parts = atob(gid).split("/");
  return parts[parts.length - 1];
};
