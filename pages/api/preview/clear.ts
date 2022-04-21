import { NextApiHandler } from "next";

const handler: NextApiHandler = async (_req, res) => {
  res.clearPreviewData();
  res.redirect("/");
};

export default handler;
