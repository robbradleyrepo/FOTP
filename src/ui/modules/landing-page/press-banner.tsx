import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { belt, ComponentStyleProps, greedy, ratio, s } from "@/common/ui/utils";

import { bodyTextSmallStatic } from "../../base/typography";

const enUsResource = {
  label: "As Seen On",
};

interface LogoAttributes {
  containerHeight: (number | null)[];
  height: number;
  relativeHeight?: number;
  width: number;
}

const getWidth = ({
  containerHeight,
  height,
  relativeHeight = 1,
  width,
}: LogoAttributes) =>
  containerHeight.map(
    (value) => value && (relativeHeight * value * width) / height
  );

const itemStyles = ({
  containerHeight,
  height,
  relativeHeight,
  width,
}: LogoAttributes) =>
  s(ratio(height / width), {
    display: "block",
    marginLeft: ["5%", "7%", "9%"],
    opacity: 0.8,
    width: getWidth({ containerHeight, height, relativeHeight, width }),
  });
const svgStyles = s(greedy, {
  overflow: "visible !important", // Prevent cropping due to sub-pixel rendering
});

type ItemProps = MaybeLinkProps & Pick<LogoAttributes, "containerHeight">;

const Forbes: FC<ItemProps> = ({
  _css = {},
  containerHeight,
  href,
  showLink,
}) => {
  const height = 380;
  const relativeHeight = 0.5;
  const width = 1391;

  return (
    <dd
      css={s(
        itemStyles({ containerHeight, height, relativeHeight, width }),
        _css
      )}
    >
      <MaybeLink href={href} showLink={showLink}>
        <svg
          css={s(svgStyles)}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Forbes</title>
          <path d="M345.6 362.9c-24.2-3.5-45.5-13.8-61.7-29.8-13.5-13.4-22.3-28.1-28.7-48.3-10.1-31.5-10.1-72 0-102.8 9.8-29.9 31.7-55.9 58.7-69.4 37.3-18.7 89.7-17.5 124.2 2.8 31.1 18.3 49.9 50.8 55.1 95.1 1.6 13.6.6 42.2-2 54-10.3 48.4-40.3 82.1-84.3 94.9-4.7 1.4-12.1 3-16.3 3.6-8.9 1.2-36.3 1.2-45-.1zm36.3-19.4c7.1-2.1 15.8-10.3 20.5-19.2 9.6-18.4 13.9-45.6 14-88.8.1-54.1-8.4-88.6-26.3-106.6-7.5-7.6-12.9-9.9-22.5-9.9-21.3 0-34.9 22.3-40.2 66.2-2.5 20.2-2.5 68.2 0 85.8 7.6 54.6 27.1 80.6 54.5 72.5zm393.2 19.4c-9.9-1-40.2-6.1-50.8-8.5l-7.3-1.7.6-39.1c1.4-94.2 1.5-145.6.7-195.6-.9-49-1.1-54.2-3-61.4-2.4-9.2-5.8-15.6-10-18.5-1.6-1.1-6-2.8-9.7-3.6-12.5-2.8-11.8-2.3-12.1-8-.2-3.3.2-5.4 1-6.1.9-1 103-20.5 106.3-20.4.9 0 1.1 13.1.6 58-.3 31.9-.4 58-.1 58 .3 0 4-1.6 8.3-3.6 12.9-6 24.8-8.5 42-9.1 11.5-.4 16.8-.1 22.7 1.1 38.5 8 67 39.5 77 85.2 2.6 11.9 3.6 41.5 1.8 56.3-1.5 12.6-5.7 29.7-10 40.7-16.5 41.7-51.8 68.9-98.7 76-10.8 1.6-44.8 1.8-59.3.3zm40.1-19.9c7.3-1.4 12.9-4.3 19-9.7 15.2-13.7 26.6-41.8 31.1-76.8 1.8-14.2 1.6-46.6-.4-58.5-5.5-32.1-17.3-53.2-34.5-61.7-7.1-3.5-8.2-3.8-16.7-3.8-6 0-11.3.6-15.7 2l-6.6 2-.5 36.5c-.6 46.8.9 164 2.2 167.4.8 2.1 1.7 2.6 5.8 2.9 9.4.7 11 .7 16.3-.3zm247.4 19.4c-49.6-8.9-85.1-44.1-96.7-95.9-1.5-6.7-2.2-14.1-2.5-28.5-.6-22.8 1.3-36.9 7.1-54.5 11.3-33.8 31.5-57.7 60.9-72 31-15.1 73.5-16.1 100.9-2.4 30.9 15.5 49.1 46.4 53.7 91.4.6 6.1 1 13.2.8 16l-.3 5-74 .3-74 .3.3 8.7c.7 20.3 5 38.2 13.1 53.7 3.7 7.1 6.6 10.9 13.7 18.1 16 16.1 31.9 22.4 57 22.4 18.2 0 31.3-3.6 45-12.5 3.8-2.5 7.7-4.5 8.6-4.5 2.1 0 6.9 6.2 6.9 8.9 0 4.4-14.3 18.6-28.3 28.1-11.5 7.7-29.6 14.8-45.4 17.5-11.1 1.9-35.9 1.9-46.8-.1zm31.4-163l17.4-.6-.6-12.4c-2.2-43.6-12.9-67.4-30.2-67.4-18.8 0-33.8 24.2-40.1 64.5-.8 4.9-1.4 10.8-1.4 13v4l18.8-.3c10.2-.1 26.5-.5 36.1-.8zm168.6 164c-17.8-1.9-46.2-8.1-55.6-12.2l-4.6-2-.6-22.8-.9-37.3-.3-14.5 2.8-1.3a22 22 0 016.8-1.5l4.1-.2 3.5 8.5c13.5 33.2 29.3 51 49.9 56.5 7.9 2.1 22.6 2.1 28.5 0 16.3-5.8 25.3-18.1 25.4-35 .1-20-10.9-29.6-52.4-45.8-25.7-10.1-34.7-15.2-45.4-26.2-11.5-11.8-17.1-25.2-18.1-43.9-1.3-22.6 5.8-41.7 21.5-57.9 15.8-16.3 36.3-25.2 64.2-27.7 24.6-2.2 62.3 3 82 11.3l3.6 1.5.6 20.4c.4 11.2.7 26.2.8 33.4l.2 13-4.8 1.8c-7.7 2.8-8.2 2.5-12.4-8.8-11.9-31.6-25.8-46.6-47.4-51.2-13.2-2.8-24.2.2-32.2 8.8-6.2 6.7-8.7 12.6-9.3 22.5-.6 10.8 1.3 16.6 7.9 23.8 8.1 8.9 21.4 16.5 47.9 27.6 32.4 13.6 47.9 25.1 56.3 41.9 5.5 10.9 7 19.6 6.5 36.4-.4 12.6-.8 15.2-3.7 23.6-9.3 27.6-30.4 45.7-63 54.3-11 2.9-12.6 3-34.6 3.3-12.9 0-25-.1-27.2-.3zm-1261.3-6c-.8-.3-1.2-2.8-1.2-7.4 0-8.3-.5-7.9 15.5-10.9 12.3-2.3 16.7-4.6 22.1-11.7 10.5-13.8 12.8-40.4 12.8-149.8 0-102.7-2-124.4-12.8-140.2-4.8-7-13-10.9-26.6-12.5L.6 23.5l-.3-8.2L0 7.1l3.3-.6c1.8-.3 65.4-.5 141.3-.3l138 .3.6 4c.4 2.2.9 24.8 1.3 50.1l.7 46.1-7.2 2.3c-10.7 3.3-10.6 3.3-15.5-9.5-11.8-31.3-25.4-49.3-44-58.5-12.8-6.3-18.7-7-54.9-7h-31.5l-.5 5.2c-1 9.8-2.6 73.2-2.6 103V172l9.2-.1c5.1 0 15.1-.4 22.3-.8 10.8-.6 14-1.2 18.5-3.3 11.1-5.1 18.6-16.4 23.2-34.8l2.4-9.5 8.2-.3 8.2-.3v120.2l-8.2-.3-8.2-.3-2.3-9.5c-4.4-17.8-12.7-30.6-23.1-35.2-4.8-2.1-16.6-3.3-39.5-4l-10.8-.3V216c0 24.6 1.4 57.9 3.1 75.9 2.4 25.2 8.8 39.1 20.4 44.1 2.2 1 9.2 2.5 15.5 3.5 6.3.9 12.3 2.1 13.2 2.6 2.4 1.3 2.6 14.3.2 15.2-1.7.8-178.2.8-180 .1zm493-.2c-.9-.6-1.2-2.9-1-7.7l.3-6.9 3.5-.7c1.9-.4 6.1-1.2 9.2-1.8 9.7-1.8 15.2-7.1 18.4-17.4 2.6-8.4 3.7-35.2 3.7-89.1.1-65.9-1.3-81.4-8-90.3-3.6-4.8-6.2-6.1-15-7.8-4.3-.8-8.9-1.7-10.1-2-2-.4-2.2-1.1-2.2-6 0-4.8.3-5.6 2.2-6.4 3-1.2 102.1-21 105.2-21h2.5l-.5 14.8c-.3 8.1-.7 19.9-.9 26.2l-.5 11.5 3.6-6.5c11.5-20.7 24.4-33.6 41.5-41.4 9.4-4.3 15.7-5.6 27.3-5.6 13.8 0 27.6 4.5 27.6 9 0 3-24.3 67.2-25.6 67.7-.7.3-5.4-1.6-10.5-4-10.7-5.1-20.8-7.7-30.5-7.6-12.2 0-25.7 4.5-31.1 10.3-2.3 2.5-2.3 2.6-2.9 39.3-.6 36.4.6 80.8 2.7 98.6 1.7 15.2 5.8 22.7 14.1 26.2 2.8 1.2 20.4 3.6 26.1 3.6.4 0 .7 3.5.5 7.8l-.3 7.8-74 .2c-40.7-.1-74.6-.4-75.3-.8z" />
        </svg>
      </MaybeLink>
    </dd>
  );
};

// TODO: replace `Forbes` with `ParentsMagazine` once the article is live
// const ParentsMagazine: FC<ItemProps> = ({
//   _css = {},
//   containerHeight,
//   href,
//   showLink,
// }) => {
//   const height = 32;
//   const relativeHeight = 0.45;
//   const width = 181;

//   return (
//     <dd
//       css={s(
//         itemStyles({ containerHeight, height, relativeHeight, width }),
//         _css
//       )}
//     >
//       <MaybeLink href={href} showLink={showLink}>
//         <svg
//           css={s(svgStyles)}
//           viewBox={`0 0 ${width} ${height}`}
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <title>Parents Magazine</title>
//           <path d="M35.3 10.332a3.904 3.904 0 0 1 3.905 3.894 3.904 3.904 0 0 1-3.905 3.893 3.904 3.904 0 0 1-3.904-3.893 3.904 3.904 0 0 1 3.904-3.894zm32.23 16.08c0 2.737.88 3.385 3.21 4.418l.198.09v.636H56.862v-.603l.153-.099c1.819-1.155 1.926-1.586 1.926-4.441V14.277c0-2.938-.224-3.403-2.177-4.52l-.169-.097v-.614h10.936v17.367zm82.11-3.276l.114-.33.65.262-.034.256c-.538 3.957-2.421 8.673-8.34 8.673-2.217 0-4.067-.683-5.352-1.977-1.36-1.368-2.039-3.326-2.019-5.817l.09-13.723-.016-1.421.215-.083c3.16-1.247 5.856-4.252 7.208-8.043l.081-.221h1.012v8.334h6.778l-.756 2.103h-6.022v13.235c0 2.12.78 3.196 2.32 3.196 1.867 0 3.326-2.294 4.07-4.444zM11.42 25.971c0 2.69.543 3.507 3.225 4.867l.183.092v.625H0v-.6l.15-.098c1.837-1.207 2.284-2.193 2.284-5.019V5.673C2.434 2.85 2.008 1.92.151.7L0 .599V0h11.416l.005 25.971zM16.764 0c7.802 0 12.46 3.506 12.46 9.379 0 5.873-4.625 9.38-12.372 9.38h-3.19v-.686l.127-.032c2.018-.504 6.713-2.568 6.713-8.662 0-3.497-1.279-6.008-3.798-7.467C15.624 1.287 14.528.84 13.8.71l-.138-.025V0h3.102zm153.713 16.426c-1.625-3.477-4.06-6.107-6.355-6.868l-.116-.037v-.815l.95.092c1.34.13 2.13.208 3.373.208 1.005 0 1.732 0 2.43-.21l.431-.128.012 7.97-.639-.03-.086-.182zM91.905 8.609c6.035.455 9.639 4.453 9.639 10.699v.333H91.022l.013-.62.152-.095c1.221-.756 1.765-2.164 1.765-4.567 0-2.61-.717-4.424-1.196-5.035l-.035-.039.004-.689.18.013zm8.604 15.41l.137-.274.646.253-.078.289c-1.304 4.797-5.67 7.71-11.024 7.71-6.998 0-11.884-4.8-11.884-11.674 0-6.393 4.461-11.21 10.85-11.714l.18-.014v.687l-.054.05c-1.526 1.408-2.298 4.712-2.298 9.976 0 5.185 2.601 8.405 6.79 8.405 2.912 0 5.556-1.345 6.735-3.695zm13.967 2.57c.007 2.666.125 3.124 1.924 4.265l.155.1v.602h-12.749v-.603l.154-.099c1.819-1.154 1.925-1.586 1.925-4.441V14.277c0-2.938-.224-3.403-2.176-4.52l-.169-.097v-.615h10.935V26.59zm15.18-.176c0 2.856.107 3.288 1.925 4.441l.153.1v.602h-12.748v-.603l.153-.099c1.82-1.155 1.928-1.586 1.928-4.441V14.59c0-2.085-1-3.33-2.677-3.33-.498 0-1.004.074-1.34.135l-.197.035v-.686l.059-.05c1.2-1.01 3.242-2.09 5.373-2.09 4.615 0 7.37 2.978 7.37 7.967v9.842zM53.908 29.47c.162 0 .57-.014.887-.15l.465-.197v.72l-.085.095C54.039 31.209 51.89 32 49.573 32c-3.833 0-6.31-2.052-6.31-5.225l.002-10.783c0-2.582-1.035-4.096-1.903-4.91-1.004-.942-2.213-1.363-2.966-1.363h-.334v-.691l.257-.061c.505-.121 2.01-.231 2.505-.231 7.392 0 10.985 2.632 10.985 8.05 0 1.26-.018 2.507-.04 3.826l-.001.103c-.022 1.374-.046 2.93-.046 4.632 0 2.852.315 4.123 2.187 4.123zm-24.465-3.043c0-5.148 5.557-6.115 10.458-6.967l1.502-.182v.65l-.114.035c-2.274.733-3.478 2.653-3.478 5.33 0 2.014.814 3.26 2.233 3.26.424 0 .805-.06 1.132-.179l.227-.082v.66l-.022.038c-.858 1.418-3.39 3-5.65 3-4.128 0-6.288-2.798-6.288-5.563zM73.283 8.609a3.904 3.904 0 0 1 3.905 3.894 3.904 3.904 0 0 1-3.905 3.894 3.904 3.904 0 0 1-3.905-3.894 3.904 3.904 0 0 1 3.905-3.894zm80.444 14.384c2.29 4.698 4.49 7.243 6.922 8.009l.115.036v.836l-.193-.03c-.551-.089-1.15-.2-1.885-.349-1.058-.218-1.97-.405-2.7-.405-.893 0-1.542.118-2.042.372l-.456.231-.505-8.907.657.028.087.18zm11.288-6.757c4.25 1.47 7.5 3.018 7.5 8.338 0 1.93-.809 3.73-2.28 5.069-1.69 1.539-4.148 2.352-7.106 2.352h-.167l-.064-.168v-.63l.164-.002c1.036-.018 1.954-.36 2.584-.964.629-.604.974-1.442.974-2.358 0-2.128-1.47-2.574-4.397-3.462l-.716-.22c-5.94-1.83-8.19-4.287-8.023-8.758.142-3.86 3.579-6.726 8.17-6.816l.17-.004v.775l-.146.018a3.195 3.195 0 0 0-2.79 3.166c0 1.793 2.335 2.498 4.593 3.179l.103.032c.478.145.973.294 1.43.453zm13.036 10.4c-1.492 0-2.657 1.223-2.657 2.63 0 1.467 1.145 2.608 2.637 2.608a2.626 2.626 0 0 0 2.656-2.608 2.625 2.625 0 0 0-2.636-2.63zm-.02.47c1.184 0 2.084.957 2.084 2.16 0 1.223-.9 2.14-2.064 2.14-1.165 0-2.064-.917-2.064-2.14 0-1.203.858-2.16 2.044-2.16zm1.512 3.302c-.062-.041-.163-.102-.266-.184-.307-.367-.47-.57-.674-.958.326-.121.552-.347.552-.692 0-.592-.532-.715-.982-.715h-1.389v.306c.347.02.367.02.367.388v1.385c0 .368-.02.368-.387.388v.306h1.368v-.306c-.326-.02-.367-.02-.367-.388v-.488h.081c.103 0 .205.02.266.142.081.143.205.386.368.652.245.326.532.408 1.001.408l.062-.244zm-1.778-1.263v-.735c0-.204.061-.245.245-.245.183 0 .49.082.49.469 0 .204-.062.326-.204.427a1.072 1.072 0 0 1-.368.084h-.163z" />
//         </svg>
//       </MaybeLink>
//     </dd>
//   );
// };

const PetAge: FC<ItemProps> = ({
  _css = {},
  containerHeight,
  href,
  showLink,
}) => {
  const height = 109;
  const relativeHeight = 0.5;
  const width = 430.5;

  return (
    <dd
      css={s(
        itemStyles({ containerHeight, height, relativeHeight, width }),
        _css
      )}
    >
      <MaybeLink href={href} showLink={showLink}>
        <svg
          css={s(svgStyles, { transform: "translateY(6%)" })}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Pet Age</title>
          <path
            d="M0,88.6h19.4V62.2h14.7c19.7,0,35.6-10.6,35.6-30.9v-0.3c0-18-12.7-30.4-33.6-30.4H0V88.6L0,88.6z M19.4,45
			V18.1h15C44,18.1,50,22.8,50,31.4v0.3C50,39.2,44.4,45,34.7,45H19.4z M104.5,90.1c12.2,0,21.2-4.8,27.5-12.6l-10.9-9.7
			c-5.3,4.9-9.9,6.9-16.3,6.9c-8.6,0-14.6-4.5-16.5-13.2h46.9c0.1-1.8,0.3-3.5,0.3-5c0-19.1-10.3-36.6-32.8-36.6
			c-19.6,0-33.3,15.8-33.3,35v0.3C69.3,75.9,84.3,90.1,104.5,90.1z M88,49.7c1.5-8.7,6.7-14.3,14.6-14.3s13.1,5.8,14.2,14.3H88z
			 M163.6,89.8c5.3,0.1,10.5-1.2,15.1-3.9V70.5c-2.9,1.6-6.1,2.4-9.4,2.4c-4.3,0-6.2-2.1-6.2-6.5V37.6h15.8V21.2H163V4h-19.1v17.2
			h-8.1v16.3h8.1v31.9C143.9,85.1,151.8,89.8,163.6,89.8L163.6,89.8z M198.7,88.6h19.7l8-19.7h37.2l8,19.7H292L254.3,0h-17.8
			L198.7,88.6L198.7,88.6z M233.4,51.8l11.7-28.5l11.7,28.5H233.4z M321.8,109c13.1,0,22.8-2.8,29-9c5.7-5.7,8.5-14.4,8.5-26.5V21.2
			h-19.1V30c-5.1-5.6-11.3-10-21.7-10c-15.5,0-29.9,11.3-29.9,31.4v0.3c0,20,14.2,31.4,29.9,31.4c10.2,0,16.3-4.2,22-10.9v3.3
			c0,12.1-6.2,18.3-19.2,18.3c-8,0.1-15.9-2.1-22.8-6.2l-6.5,14.3C301.2,106.7,311.4,109.1,321.8,109L321.8,109z M324.1,67.3
			c-9.3,0-16.3-6.3-16.3-15.6v-0.3c0-9.2,7-15.6,16.3-15.6s16.5,6.4,16.5,15.6v0.3C340.5,60.9,333.4,67.3,324.1,67.3z M399.6,90.1
			c12.2,0,21.3-4.8,27.5-12.6l-10.9-9.7c-5.3,4.9-9.9,6.9-16.4,6.9c-8.5,0-14.6-4.5-16.5-13.2h46.9c0.1-1.8,0.3-3.5,0.3-5
			c0-19.1-10.3-36.6-32.8-36.6c-19.6,0-33.3,15.8-33.3,35.1v0.3C364.4,75.9,379.4,90.1,399.6,90.1L399.6,90.1z M383.1,49.7
			c1.5-8.7,6.7-14.3,14.6-14.3s13.1,5.8,14.2,14.3H383.1z"
          />
        </svg>
      </MaybeLink>
    </dd>
  );
};

const PetsPlus: FC<ItemProps> = ({
  _css = {},
  containerHeight,
  href,
  showLink,
}) => {
  const height = 78.39;
  const relativeHeight = 0.6;
  const width = 198.24;

  return (
    <dd
      css={s(
        itemStyles({ containerHeight, height, relativeHeight, width }),
        _css
      )}
    >
      <MaybeLink href={href} showLink={showLink}>
        <svg
          css={s(svgStyles, { transform: "translateY(6%)" })}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Pets+</title>
          <path d="M187.11 31.1v11.55h-9.82V31.1h-11.14v-9.55h11.14V10.01h9.82v11.55h11.14v9.55h-11.14zM163.8 46.58c0 10.15-6.82 15.31-19.09 15.31-7.75 0-14.66-2.03-19.74-4.61l1.85-11.9c5.9 3.51 13 5.44 17.71 5.44 3.23 0 4.43-.92 4.43-2.4s-.83-2.31-6.55-3.78c-11.71-3.04-16.79-6.09-16.79-14.85 0-8.95 6.46-14.85 18.17-14.85 6.36 0 12.63 1.29 17.52 3.51l-1.85 11.9c-5.35-2.86-11.25-4.43-15.49-4.43-2.58 0-3.6.83-3.6 2.03 0 1.38.83 2.12 6.92 3.78 12.54 3.41 16.51 6.45 16.51 14.85m-40.86 14.2c-2.58.74-4.8 1.11-8.76 1.11-10.51 0-17.99-3.87-17.99-16.51v-16.6h-5.72V15.59h5.72v-13L112.52 0v15.59h8.21l2.03 13.19h-10.24V42.8c0 3.69 1.94 5.17 5.35 5.17 1.01 0 2.12-.18 3.14-.55l1.93 13.36m-49.25-26.1c-.18-6.64-2.31-9.96-5.63-9.96s-5.44 3.32-5.53 9.96h11.16m15.4 3.96c0 1.75-.09 3.5-.28 4.43h-26c.92 5.72 4.98 7.65 10.33 7.65 4.43 0 9.41-1.57 14.48-4.15l1.48 10.88c-4.98 2.86-11.16 4.7-18.17 4.7-14.48 0-24.44-7.38-24.44-23.43 0-15.03 9.32-24.07 22.04-24.07 14.38.01 20.56 10.53 20.56 23.99m-61.61-.27c0-6.73-2.21-9.13-5.35-9.13-2.12 0-3.87 1.38-5.72 3.32v15.49c1.38.55 2.49.92 4.52.92 3.69 0 6.55-2.76 6.55-10.6m16.42-1.2c0 17.71-9.04 24.44-18.63 24.44-3.97 0-6.36-.65-8.85-1.38v15.59L0 78.39v-62.8h14.76l.92 5.72c2.95-3.23 6.92-6.64 12.45-6.64 9.13-.01 15.77 7 15.77 22.5" />
        </svg>
      </MaybeLink>
    </dd>
  );
};

const USAToday: FC<ItemProps> = ({
  _css = {},
  containerHeight,
  href,
  showLink,
}) => {
  const height = 32;
  const relativeHeight = 1;
  const width = 78;

  return (
    <dd
      css={s(
        itemStyles({ containerHeight, height, relativeHeight, width }),
        _css
      )}
    >
      <MaybeLink href={href} showLink={showLink}>
        <svg
          css={s(svgStyles)}
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>PetVet Magazine</title>
          <path d="M36 12.75a1.53 1.53 0 001.18-.45 1.82 1.82 0 00.38-1.3V5.43h2.53V11A3.7 3.7 0 0139 13.85a4.29 4.29 0 01-3 1 4.28 4.28 0 01-3-1A3.7 3.7 0 0131.84 11V5.43h2.53V11a1.81 1.81 0 00.42 1.28 1.52 1.52 0 001.21.47zM45.14 14.86a6.09 6.09 0 01-2.14-.39 5.26 5.26 0 01-1.8-1.11l1.22-1.54a4.17 4.17 0 001.22.77 3.89 3.89 0 001.5.28 1.64 1.64 0 00.86-.19.63.63 0 00.31-.57.67.67 0 00-.37-.59 5.35 5.35 0 00-1.3-.52l-.57-.15a4 4 0 01-1.9-1 2.35 2.35 0 01-.65-1.71 2.65 2.65 0 01.48-1.5 3 3 0 011.28-1 4.64 4.64 0 011.89-.36 5.38 5.38 0 012 .39 5.82 5.82 0 011.71 1.03l-1.26 1.59a5.07 5.07 0 00-1.15-.73 3 3 0 00-1.31-.31 1.58 1.58 0 00-.84.18A.6.6 0 0044 8a.7.7 0 00.31.56 3.15 3.15 0 001.08.44l.69.19a4.25 4.25 0 012.11 1.12 2.42 2.42 0 01.62 1.65 2.65 2.65 0 01-.46 1.54 3 3 0 01-1.29 1 4.73 4.73 0 01-1.92.36zM56.46 14.68L55.87 13h-3.46l-.58 1.73h-2.5l3.39-9.25h2.94l3.34 9.2zM53 11.08h2.19l-1.04-3.24zM34.59 26.53v-7.21h-2.75v-2h8v2h-2.72v7.21zM45.16 26.71a4.92 4.92 0 01-2.47-.61A4.49 4.49 0 0141 24.4a4.87 4.87 0 01-.63-2.48 5.15 5.15 0 01.34-1.92 4.48 4.48 0 011-1.52 4.61 4.61 0 011.52-1 5.38 5.38 0 013.83 0 4.62 4.62 0 011.52 1 4.47 4.47 0 011 1.52 5.13 5.13 0 01.42 1.92 4.87 4.87 0 01-.62 2.48 4.49 4.49 0 01-1.71 1.69 4.92 4.92 0 01-2.51.62zm0-2.09a2 2 0 001.16-.34 2.3 2.3 0 00.78-.95 3.26 3.26 0 00.29-1.41 3.31 3.31 0 00-.29-1.41 2.35 2.35 0 00-.78-1 2.12 2.12 0 00-2.33 0 2.35 2.35 0 00-.78 1 3.31 3.31 0 00-.29 1.41 3.26 3.26 0 00.29 1.41 2.3 2.3 0 00.78.95 2 2 0 001.17.33zM51.41 26.53v-9.25h3.65a4.88 4.88 0 012.43.59 4.31 4.31 0 011.65 1.63 5.12 5.12 0 010 4.8 4.31 4.31 0 01-1.65 1.63 4.88 4.88 0 01-2.43.59zm2.49-2h1.16a1.91 1.91 0 001.57-.72 3 3 0 00.58-1.9 3 3 0 00-.58-1.9 1.91 1.91 0 00-1.57-.72H53.9zM67.2 26.53l-.58-1.73h-3.47l-.58 1.73h-2.5l3.39-9.25h2.94l3.39 9.25zm-3.41-3.6H66l-1.09-3.24zM74.67 23.2v3.33H72.1V23.2l-3.28-5.92h2.86L73.39 21l1.7-3.67h2.86z" />
          <circle cx="14" cy="16" r="14" />
        </svg>
      </MaybeLink>
    </dd>
  );
};

interface MaybeLinkProps extends ComponentStyleProps {
  href: string;
  showLink: boolean;
}

const MaybeLink: FC<MaybeLinkProps> = ({ children, href, showLink }) =>
  showLink ? (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  ) : (
    <span>{children}</span>
  );

interface LandingPagePressBanner extends ComponentStyleProps {
  showLinks?: boolean;
}

const LandingPagePressBanner: FC<LandingPagePressBanner> = ({
  _css = {},
  showLinks = false,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "LandingPagePressBanner", enUsResource);

  const listHeight = [32, 48, 56];

  return (
    <dl
      css={s(
        belt,
        {
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          maxWidth: [320, 400, "unset"],
          width: "100%",
        },
        _css
      )}
    >
      <dt
        css={s(bodyTextSmallStatic, {
          "&:after": { content: "':'" },
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        })}
      >
        {t("LandingPagePressBanner:label")}
      </dt>

      <USAToday
        containerHeight={listHeight}
        href="https://usatoday.com"
        showLink={showLinks}
      />

      <Forbes
        containerHeight={listHeight}
        href="https://www.forbes.com/"
        showLink={showLinks}
      />

      <PetsPlus
        containerHeight={listHeight}
        href="https://petsplusmag.com/front-of-the-pack-names-veterinarian-dr-jamie-peyton-as-chief-science-officer/"
        showLink={showLinks}
      />

      <PetAge
        _css={s({ display: ["none", "block"] })}
        containerHeight={listHeight}
        href="https://www.petage.com/front-of-the-pack-adds-dr-jamie-peyton-to-science-advisory-board/"
        showLink={showLinks}
      />
    </dl>
  );
};

export default LandingPagePressBanner;