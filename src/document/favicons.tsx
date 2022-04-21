import { getUploadedImageUrl } from "@sss/cloudinary";
import Head from "next/head";
import React from "react";

import { color } from "../ui/styles/variables";

const androidIconSizes = [36, 48, 72, 96, 144, 192, 512];
const appleTouchIconSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];
const iconSizes = [16, 32, 96, 192];

const Favicons = () => (
  <Head>
    {appleTouchIconSizes.map((size) => (
      <link
        key={size}
        href={getUploadedImageUrl({
          publicId: "/favicon/fotp",
          version: "v1583859959",
          width: size,
        })}
        rel="apple-touch-icon"
        sizes={`${size}x${size}`}
      />
    ))}
    {iconSizes.map((size) => (
      <link
        key={size}
        href={getUploadedImageUrl({
          publicId: "/favicon/fotp-transparent",
          version: "v1585243015",
          width: size,
        })}
        rel="icon"
        sizes={`${size}x${size}`}
        type="image/png"
      />
    ))}
    <link
      rel="manifest"
      href={`data:application/json,${encodeURIComponent(
        JSON.stringify({
          icons: androidIconSizes.map((size) => ({
            sizes: `${size}x${size}`,
            src: getUploadedImageUrl({
              publicId: "/favicon/fotp",
              version: "v1572434037",
              width: size,
            }),
            type: "image/png",
          })),
        })
      )}`}
    />
    <meta content={color.background.feature1} name="msapplication-TileColor" />
    <meta
      content={getUploadedImageUrl({
        publicId: "/favicon/fotp",
        version: "v1572434037",
        width: 144,
      })}
      name="msapplication-TileImage"
    />
    <meta content={color.background.dark} name="theme-color" />
  </Head>
);

export default Favicons;
