import { Metadata } from "@sss/seo";
import React, { FC, useState } from "react";
import ResponsiveImage from "src/ui/base/responsive-image";

import { belt, gutter, percentage, s, Style, StyleFn } from "@/common/ui/utils";

import TEMP1_IMG from "../assets/images/styling-system/1-640x640.jpg";
import TEMP2_IMG from "../assets/images/styling-system/2-640x640.jpg";
import TEMP3_IMG from "../assets/images/styling-system/3-640x640.jpg";
import TEMP4_IMG from "../assets/images/styling-system/4-640x640.jpg";
import TEMP5_IMG from "../assets/images/styling-system/5-640x640.jpg";
import TEMP6_IMG from "../assets/images/styling-system/6-640x640.jpg";
import IMAGES_2_IMG from "../assets/images/styling-system/234-480x480.jpg";
import IMAGES_1_IMG from "../assets/images/styling-system/665-640x480.jpg";
import Accordion from "../ui/base/accordion";
import { primaryButton, secondaryButton } from "../ui/base/button";
import {
  CarouselController,
  CarouselUI,
  useCarouselController,
} from "../ui/base/carousel";
import { Grid, Item } from "../ui/base/grid";
import Icon from "../ui/base/icon";
import Logo from "../ui/base/logo";
import Modal, { ModalType } from "../ui/base/modal/index";
import { Tab, TabList, TabPanel, Tabs } from "../ui/base/tabs";
import { ToastRack, ToastType, useToastController } from "../ui/base/toast";
import {
  bodyText,
  bodyTextExtraSmall,
  bodyTextSmall,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingDelta,
  headingEcho,
} from "../ui/base/typography";

const listItemStyle: StyleFn = (t) => ({
  padding: t.spacing.md,
});

const carouselImageUrls = [
  TEMP1_IMG.src,
  TEMP2_IMG.src,
  TEMP3_IMG.src,
  TEMP4_IMG.src,
  TEMP5_IMG.src,
  TEMP6_IMG.src,
];

const CarouselFooter: FC<{ css?: Style }> = ({ css = {} }) => {
  const { currentIndex } = useCarouselController();

  return (
    <div
      css={s(
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        },
        css
      )}
    >
      <div
        css={s((t) => ({
          marginRight: t.spacing.sm,
        }))}
      >
        Current slide:{" "}
      </div>

      <div
        css={s({
          display: "inline-block",
          flexShrink: 0,
          width: [80, null, null],
        })}
      >
        <ResponsiveImage
          alt=""
          priority
          width={80}
          height={80}
          sizes={{ width: "100vw" }}
          src={carouselImageUrls[currentIndex]}
        />
      </div>
    </div>
  );
};

const StylingSystem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  const closeLeftDrawer = () => setIsLeftDrawerOpen(false);
  const openLeftDrawer = () => setIsLeftDrawerOpen(true);

  const closeRightDrawer = () => setIsRightDrawerOpen(false);
  const openRightDrawer = () => setIsRightDrawerOpen(true);

  const toastController = useToastController();

  return (
    <>
      <Metadata noindex title="Styled Components Test | Front Of The Pack" />
      <main>
        <header
          css={s(gutter, (t) => ({ backgroundColor: t.color.background.base }))}
        >
          <Logo
            _css={s((t) => ({
              marginBottom: t.spacing.md,
              width: [96, 128, 140],
            }))}
            fill="currentColor"
          />
          <h1 css={s(headingAlpha)}>Styling System</h1>
        </header>
        <section css={s(gutter)}>
          <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            Typography
          </h2>
          <div
            css={s(belt, (t) => ({
              "& > *": {
                marginBottom: t.spacing.md,
              },
            }))}
          >
            <p css={s(headingAlpha)}>Heading Alpha</p>
            <p css={s(headingBravo)}>Heading Bravo</p>
            <p css={s(headingCharlie)}>Heading Charlie</p>
            <p css={s(headingDelta)}>Heading Delta</p>
            <p css={s(headingEcho)}>Heading Echo</p>
            <p css={s(bodyText)}>
              Body Text: Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Praesent sed cursus mi. Sed id leo iaculis, auctor libero
              non, fermentum dui. Vivamus dapibus in mauris at vehicula. Cras
              condimentum sit amet lacus quis pretium. Pellentesque in libero eu
              sem eleifend facilisis. Vivamus ac consequat quam. Morbi commodo
              sollicitudin dictum. Nam sit amet mauris id velit viverra gravida
              vitae sed mi. Aliquam erat volutpat. Etiam id porta felis.
            </p>
            <p css={s(bodyTextSmall)}>
              Body Text Small: Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Proin mattis mollis cursus. Praesent ultrices
              mattis lorem eget egestas. Integer nec libero convallis, ultrices
              quam id, fringilla lorem. Integer at est malesuada, facilisis
              lacus a, lobortis mauris. In pulvinar finibus felis vel placerat.
              Donec et luctus lorem. Etiam auctor eros a varius vulputate. Donec
              mi diam, laoreet et mauris ut, laoreet aliquam felis. Nulla sed
              felis ac est vulputate facilisis. Donec tempor malesuada ante,
              vitae dignissim erat efficitur eu. Duis a ligula posuere, cursus
              nisi nec, porta elit.
            </p>
            <p css={s(bodyTextExtraSmall)}>
              Body Text Extra Small: Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Phasellus quam sapien, feugiat ut interdum et,
              ullamcorper vel ipsum. Morbi ullamcorper ultricies leo sed
              pharetra. Duis quis leo sit amet velit facilisis tristique. Nulla
              in magna efficitur, cursus purus id, faucibus lacus. Ut massa
              orci, ornare a lacus at, rhoncus fringilla est. Cras elementum
              scelerisque sem, in faucibus quam maximus eu. In ut ante quis erat
              posuere pretium vitae ut est. Nunc malesuada velit est, vitae
              fringilla urna elementum id. Quisque hendrerit luctus dui. Nulla
              vestibulum pulvinar eros nec tincidunt.
            </p>
          </div>
        </section>
        <section>
          <div css={s(gutter)}>
            <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
              Buttons
            </h2>
            <div css={s(belt, { maxWidth: 480 })}>
              <button
                css={s(primaryButton(), (t) => ({
                  marginBottom: t.spacing.md,
                  marginRight: t.spacing.md,
                }))}
              >
                Click me
              </button>
              <button css={s(secondaryButton())}>Click me</button>
            </div>
          </div>
          <div
            css={s(gutter, (t) => ({
              backgroundColor: t.color.background.base,
            }))}
          >
            <div css={s(belt, { maxWidth: 480 })}>
              <button
                css={s(primaryButton({ disabled: true }), (t) => ({
                  marginBottom: t.spacing.md,
                  marginRight: t.spacing.md,
                }))}
                disabled
              >
                Click me
              </button>
              <button css={s(secondaryButton({ disabled: true }))} disabled>
                Click me
              </button>
            </div>
          </div>
          <div
            css={s(gutter, (t) => ({
              backgroundColor: t.color.background.dark,
            }))}
          >
            <button
              css={s(secondaryButton({ disabled: true }), (t) => ({
                marginBottom: t.spacing.md,
                marginRight: t.spacing.md,
              }))}
              disabled
            >
              Click me
            </button>
            <div css={s(belt, { maxWidth: 480 })}>
              <button
                css={s(secondaryButton({ disabled: true, reverse: true }))}
                disabled
              >
                Click me
              </button>
            </div>
          </div>
        </section>
        <section css={s(gutter)}>
          <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            Icons
          </h2>
          <div css={s(belt)}>
            <Icon
              _css={s({
                display: "block",
                margin: "auto",
                width: 100,
              })}
              path="M53 70.1c1.6 3.8 2.6 7.8 2.5 11.9 0 .6 0 1.2-.1 1.9 0 .1-.1.2-.1.3 0 .1 0 .2-.1.3-.3 1.2-1.2 1.9-2.3 1.9-.7-.1-1.2-.4-1.6-.9-.4-.4-.6-1-.6-1.7v-.1-.1-.1c0-.6.1-1.1.1-1.6-.1-6.7-2.7-12.3-6.9-17.3-.4-.6-.9-1.5-.9-2.2v-.1-.1c-.1-.9.6-1.6 1.4-1.9 1-.3 1.7 0 2.5.7 2.6 2.7 4.6 5.7 6.1 9.1zM12.1 34.3c-1-.7-2.3-.6-3.2.4 0 0 0 .1-.1.1 0 0-.1 0-.1.1l-.2.2c-.1.1-.1.2-.2.3-.1.2-.2.4-.4.5-3.3 4.4-5.5 9.3-6.7 14.6-.4 2-.7 4-.8 6v.1c0 .4 0 .8-.1 1.4.1 1.3 1 2.3 2.3 2.3.7 0 1.3-.3 1.7-.8.5-.4.8-1.1.8-1.8 0-5.5 1.6-10.7 4.3-15.5.9-1.6 2-3 3-4.6.9-1.3.6-2.6-.3-3.3zm65.6-.8v14.8c-.1 9.6-.9 19-3.2 28.3-.9 3.3-1.9 6.7-4 9.6-.5.7-1.2 1.1-1.8 1.3-.7.3-1.4.3-2.1-.3-1.2-.9-1.3-2.2-.3-3.6 2.2-3 3-6.5 3.8-10 2.2-10.6 2.6-21.2 2.6-31.9v-7.8c0-1.7-1-2.9-2.5-2.9-.2 0-.4 0-.5.1-1 .4-1.6 1.4-1.6 2.7v16.1c0 1.4-.8 2.4-1.9 2.5-.4.1-.8.2-1.3.1-1-.1-1.7-1.2-1.7-2.5V29.3v-4.1c0-1.6-1-2.8-2.5-2.8-.2 0-.4 0-.6.1-.9.4-1.5 1.3-1.5 2.5v22.8c0 1.3-.8 2.2-1.9 2.3-.3.1-.5.1-.8.1-1.3-.1-2.2-1-2.2-2.5V34.5 22c0-1.7-1-2.9-2.5-2.9-.2 0-.5 0-.7.1-.9.4-1.5 1.4-1.5 2.7v29.5c0 1.2-.7 2.1-1.7 2.3-.3.2-.6.3-1 .3-1.3 0-2.3-1-2.3-2.5V35.7 25c0-1.3-.9-2.5-2.2-2.6h-.7c-.7.3-1.3.8-1.6 1.6-.1.4-.1 1-.1 1.6v37.6c0 1.5-.7 2.5-1.7 2.7-.4.2-.8.2-1.3.2-.9 0-1.4-.7-1.9-1.5-2.2-3.8-4.3-7.5-6.5-11.3-.1-.4-.4-1-.9-1.2-.5-.2-1.1-.4-1.6-.3-.4.3-.7.8-.8 1.3-.1.9 0 1.7.3 2.6 2.9 7.8 6.1 15.4 10.7 22.3.9 1.3 2 2.6 3 3.9 1 1.2 1.2 2.5.1 3.5-.3.4-.7.6-1.1.6-.9.4-1.9.1-2.8-.8-3-3.2-5.5-7-7.4-11-2.5-5.2-4.8-10.7-7.1-16.1-.7-2-1-4.1-.6-6.2.5-2.4 1.9-4.1 4.3-4.7.4-.1.9-.3 1.4-.3 2.7-.4 5.1.7 6.5 3 .9 1.3 1.6 2.6 2.3 3.9.1.2.2.4.3.5 0-1.6 0-3.1-.4-4.6 0-8 .1-16 0-23.9-.1-3.8 2.2-6.6 5.1-7.6 1.7-.7 3.6-.7 5.4.1 1.1-1.7 2.5-2.9 4.3-3.4.7-.2 1.5-.4 2.4-.4 2.9 0 4.9 1.4 6.3 3.9.2-.1.4-.2.6-.2 2.4-.9 4.8-.6 7 1 2.3 1.7 3 4.4 2.7 7.1 1.4 0 2.9-.3 4.3 0 3.3.9 5.4 3.8 5.4 7.2zM34.5 54.7c-.1 0 0 0 0 0zm62.2-26.8c-1.7-5.4-4.3-10-8.4-13.9l-.1-.1s-.1 0-.1-.1c-.1-.1-.3-.2-.4-.3l-.6-.3H86.2c-.1 0-.2 0-.3.1-.1 0-.2 0-.3.1-.3.1-.7.4-1 .7-.9 1-.7 2.3.3 3.5 1.2 1.2 2.3 2.5 3.2 3.8 3.2 4.6 4.9 9.7 5.8 15.2.3 1.5 1.3 2.3 2.6 2.2 1.3-.1 2.2-1.3 2.3-2.6-.8-3-1.4-5.7-2.1-8.3zM17 42.5c-1-.6-2.5-.4-3.2.6-.4.5-.7 1-1.1 1.6-1.9 2.8-3 6-3.1 9.4v.5c0 .2 0 .4.1.5.3 1.2 1.1 1.9 2.2 2.1 1.3 0 2.2-1 2.3-2.6 0-.9.1-1.7.3-2.5.4-2.3 1.6-4.2 2.9-6.1.3-.3.4-.7.5-1.1v-.5c.1-.7-.2-1.4-.9-1.9zm63.7-20.3s-.1.1 0 0l-.1.1s0 .1-.1.1c-.1.1-.2.2-.2.4-.1.2-.1.3-.2.5v.2c-.1.7.1 1.5.5 2.2 1 1.5 2 2.9 2.9 4.5.6 1.2.7 2.6 1.2 4.1.3 1.3 1.3 2.2 2.5 2 .6-.1 1.1-.4 1.5-.9.4-.5.7-1.1.7-2-.6-4.1-2.2-7.8-5.2-11.2-1.2-1-2.7-.8-3.5 0z"
            />
          </div>
        </section>
        <section css={s(gutter)}>
          <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            Background Colours
          </h2>
          <ul>
            <li
              css={s(listItemStyle, (t) => ({
                backgroundColor: t.color.background.base,
              }))}
            >
              base
            </li>
            <li
              css={s(listItemStyle, (t) => ({
                backgroundColor: t.color.background.dark,
              }))}
            >
              forest
            </li>
            <li
              css={s(listItemStyle, (t) => ({
                backgroundColor: t.color.background.feature1,
              }))}
            >
              peppermint
            </li>
            <li
              css={s(listItemStyle, (t) => ({
                backgroundColor: t.color.background.feature2,
              }))}
            >
              mushroom
            </li>
            <li
              css={s(listItemStyle, (t) => ({
                backgroundColor: t.color.background.feature3,
              }))}
            >
              moss
            </li>
            <li
              css={s(listItemStyle, (t) => ({
                backgroundColor: t.color.background.feature4,
              }))}
            >
              sage
            </li>
            <li
              css={s(listItemStyle, (t) => ({
                backgroundColor: t.color.background.feature5,
              }))}
            >
              pistachio
            </li>
            <li
              css={s(listItemStyle, (t) => ({
                backgroundColor: t.color.background.light,
              }))}
            >
              light
            </li>
          </ul>
        </section>
        <section
          css={s(gutter, (t) => ({ backgroundColor: t.color.background.base }))}
        >
          <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            Images
          </h2>
          <div css={s(belt)}>
            <div
              css={s({
                display: "inline-block",
                flexShrink: 0,
                width: [310, null, 640],
              })}
            >
              <ResponsiveImage
                alt=""
                priority
                width={640}
                height={480}
                sizes={{ width: "100vw" }}
                src={IMAGES_1_IMG}
              />
            </div>
            <div
              css={s({
                display: "inline-block",
                flexShrink: 0,
                width: [120, null, 480],
              })}
            >
              <ResponsiveImage
                _css={s((t) => ({
                  borderRadius: t.radius.xxl,
                }))}
                alt=""
                priority
                width={480}
                height={480}
                sizes={{ width: "100vw" }}
                src={IMAGES_2_IMG}
              />
            </div>
          </div>
        </section>
        <section css={s(gutter)}>
          <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            Carousel
          </h2>
          <CarouselController
            slides={carouselImageUrls.map((src) => (
              <a key={src} href={src}>
                <ResponsiveImage
                  alt=""
                  width={480}
                  height={480}
                  sizes={{ width: "100vw" }}
                  src={src}
                />
              </a>
            ))}
            slidesToShow={[1, 2, 3, 4]}
          >
            <CarouselUI
              _css={s((t) => ({ marginBottom: t.spacing.lg }))}
              gutter={(t) => t.spacing.md}
            />
            <CarouselFooter />
          </CarouselController>
        </section>
        <section css={s(gutter)}>
          <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            Grid
          </h2>
          <div css={s(belt)}>
            <Grid
              gx={(t) => t.spacing.md}
              gy={(t) => t.spacing.md}
              itemWidth={[
                percentage(1),
                percentage(1 / 2),
                percentage(1 / 3),
                percentage(1 / 4),
                percentage(1 / 6),
              ]}
            >
              {[
                TEMP1_IMG.src,
                TEMP2_IMG.src,
                TEMP3_IMG.src,
                TEMP4_IMG.src,
                TEMP5_IMG.src,
                TEMP6_IMG.src,
                TEMP5_IMG.src,
                TEMP4_IMG.src,
                TEMP6_IMG.src,
                TEMP1_IMG.src,
                TEMP3_IMG.src,
                TEMP2_IMG.src,
              ].map((src) => (
                <Item key={src}>
                  <ResponsiveImage
                    alt=""
                    width={480}
                    height={480}
                    sizes={{ width: "100vw" }}
                    src={src}
                  />
                </Item>
              ))}
            </Grid>
          </div>
        </section>
        <section css={s(gutter)}>
          <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            Accordion
          </h2>
          <div css={s(belt)}>
            <Accordion
              id="accordion0"
              initiallyOpen
              label="An accordion item"
              labelAs="h3"
            >
              <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.md }))}>
                This content is initially visible because its{" "}
                <code>initiallyOpen</code> prop is <code>true</code>.
              </p>
            </Accordion>
            <Accordion
              id="accordion1"
              label="Another accordion item"
              labelAs="h3"
            >
              <p css={s(bodyText, (t) => ({ marginBottom: t.spacing.md }))}>
                This content is hidden until the user clicks on the label.
              </p>
            </Accordion>
          </div>
        </section>
        <section css={s(gutter)}>
          <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            Tabs
          </h2>
          <div css={s(belt)}>
            <Tabs initialTabId="foo">
              <TabList label="Test Tabs">
                <Tab id="foo">Foo</Tab>
                <Tab id="bar">Bar</Tab>
                <Tab id="baz">Baz</Tab>
              </TabList>
              <TabPanel id="foo">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                scelerisque ac nisl faucibus finibus. Suspendisse sit amet
                pharetra justo. Aliquam porta pretium consectetur. Sed sed leo
                elit. Etiam ex diam, luctus in pellentesque eget, suscipit in
                enim. Ut scelerisque nisi non quam tempor tempus. Praesent eget
                varius risus. Nullam id sapien scelerisque, tempor massa
                imperdiet, scelerisque dolor. Nam sed consectetur velit. Nullam
                non dolor ut risus molestie convallis sit amet ac ligula.
                Curabitur viverra lorem ligula, dapibus varius est dapibus et.
                Donec diam leo, fringilla id massa sit amet, laoreet tempus
                enim.
              </TabPanel>
              <TabPanel id="bar">
                Aliquam feugiat nec purus ut venenatis. Aenean quis tellus vitae
                sem finibus vehicula. Vivamus vitae tellus sit amet diam
                vestibulum iaculis eu eget neque. Phasellus suscipit nibh lacus,
                ut laoreet ipsum lobortis quis. Sed dolor nisi, commodo a ipsum
                sit amet, lobortis ultrices nulla. Class aptent taciti sociosqu
                ad litora torquent per conubia nostra, per inceptos himenaeos.
                Aenean non vulputate justo. Vestibulum placerat lobortis sem, in
                aliquam mi vulputate sit amet. Maecenas bibendum neque eget
                risus lacinia aliquam. Proin rhoncus, mi pulvinar feugiat
                porttitor, risus ex porttitor nunc, vitae sodales augue ipsum ut
                libero. Vestibulum tempor nibh a eros vestibulum blandit. Mauris
                nulla urna, lobortis vitae egestas et, posuere id mauris. Sed
                orci felis, maximus at orci sed, vulputate varius quam.
              </TabPanel>
              <TabPanel id="baz">
                Ut a rhoncus nulla. Morbi a mollis sem, nec lobortis lectus. Sed
                eleifend in erat eget ornare. Nam vehicula euismod erat. Proin
                iaculis tellus feugiat risus sodales, non hendrerit ex iaculis.
                Aenean non laoreet nisl. Nam commodo iaculis pretium. Morbi
                lorem neque, tempor elementum pretium eu, posuere vitae justo.
                Praesent tincidunt, lacus ut sagittis iaculis, est nisl sagittis
                magna, eget rutrum turpis nisl at quam.
              </TabPanel>
            </Tabs>
          </div>
        </section>
        <section css={s(gutter)}>
          <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            Modals
          </h2>
          <div css={s(belt)}>
            <Modal
              _css={s({ maxWidth: 640 })}
              labelledBy="modal-label"
              onClose={closeModal}
              open={isModalOpen}
              type={ModalType.POPUP}
            >
              <div css={s(gutter)}>
                <p css={s(bodyText)} id="modal-label">
                  Hello world
                </p>
                <button
                  css={s((t) => ({
                    position: "absolute",
                    right: t.spacing.sm,
                    top: t.spacing.sm,
                  }))}
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </Modal>
            <Modal
              labelledBy="drawer-left-label"
              onClose={closeLeftDrawer}
              open={isLeftDrawerOpen}
              type={ModalType.DRAWER}
            >
              <p css={s(bodyText)} id="drawer-left-label">
                Hello world
              </p>
              <button
                css={s((t) => ({
                  position: "absolute",
                  right: t.spacing.sm,
                  top: t.spacing.sm,
                }))}
                onClick={closeLeftDrawer}
              >
                Close
              </button>
            </Modal>
            <Modal
              alignment="right"
              labelledBy="drawer-right-label"
              onClose={closeRightDrawer}
              open={isRightDrawerOpen}
              type={ModalType.DRAWER}
            >
              <p
                id="drawer-right-label"
                css={s(bodyText, { transform: "rotateY(180deg)" })}
              >
                Hello world
              </p>
              <button
                css={s((t) => ({
                  left: t.spacing.sm,
                  position: "absolute",
                  top: t.spacing.sm,
                }))}
                onClick={closeRightDrawer}
              >
                Close
              </button>
            </Modal>
            <Grid
              gx={(t) => t.spacing.xl}
              gy={(t) => t.spacing.xl}
              itemWidth={[percentage(1), null, percentage(1 / 3)]}
            >
              <Item
                _css={s({
                  display: "flex",
                  justifyContent: ["center", null, "flex-start"],
                })}
              >
                <button css={s(primaryButton())} onClick={openModal}>
                  Open modal
                </button>
              </Item>
              <Item
                _css={s({
                  display: "flex",
                  justifyContent: ["center", null, "flex-start"],
                })}
              >
                <button css={s(primaryButton())} onClick={openLeftDrawer}>
                  Open left-hand drawer
                </button>
              </Item>
              <Item
                _css={s({
                  display: "flex",
                  justifyContent: ["center", null, "flex-end"],
                })}
              >
                <button css={s(primaryButton())} onClick={openRightDrawer}>
                  Open right-hand drawer
                </button>
              </Item>
            </Grid>
          </div>
        </section>

        <section css={s(gutter)}>
          <h2 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            Toast
          </h2>

          <ToastRack
            _css={s({
              height: 0,
              position: "fixed",
              right: 0,
              top: 20,
              zIndex: 99999,
            })}
          />
          <Grid
            gx={(t) => t.spacing.xl}
            gy={(t) => t.spacing.xl}
            itemWidth={percentage(1 / 3)}
          >
            <Item>
              <button
                onClick={() =>
                  toastController.push({
                    children: "Info toast",
                    type: ToastType.INFO,
                  })
                }
              >
                Add info toast
              </button>
            </Item>
            <Item>
              <button
                onClick={() =>
                  toastController.push({
                    children: "Warning toast",
                    type: ToastType.WARNING,
                  })
                }
              >
                Add warning toast
              </button>
            </Item>
            <Item>
              <button
                onClick={() =>
                  toastController.push({
                    children: "Error toast",
                    type: ToastType.ERROR,
                  })
                }
              >
                Add error toast
              </button>
            </Item>
          </Grid>
        </section>
      </main>
    </>
  );
};

export default StylingSystem;
