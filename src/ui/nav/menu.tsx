import { useQuery } from "@apollo/react-hooks";
import { captureException } from "@sentry/nextjs";
import { trackSelectItemEvent } from "@sss/ecommerce/analytics";
import {
  COLLECTION_NAVIGATION,
  CollectionData,
} from "@sss/ecommerce/collection";
import { ProductCore } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { motion, Variants } from "framer-motion";
import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { ComponentStyleProps, px, py, s } from "@/common/ui/utils";

import { THEMES_ENGINE } from "../../config";
import Icon from "../base/icon";
import Modal, { ModalType, useModalController } from "../base/modal";
import {
  bodyTextExtraSmall,
  bodyTextSmall,
  headingBravo,
  headingCharlie,
} from "../base/typography";
import burgerMenu from "../icons/burgerMenu";
import drawerClose from "../icons/drawerClose";
import SocialIcons from "../modules/social-icons";

const menuContainerMobile: Variants = {
  hidden: {
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
  visible: {
    transition: { delayChildren: 0.02, staggerChildren: 0.04 },
  },
};

const menuContainerDesktop: Variants = {
  hidden: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  visible: {
    transition: { delayChildren: 0.05, staggerChildren: 0.08 },
  },
};

const items: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      x: { stiffness: 1000 },
    },
    x: -50,
  },
  visible: {
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
    x: 0,
  },
};

export type MenuGroup = "learn" | "about" | "science" | "shop";

interface MenuContextProps {
  menuGroup: MenuGroup | null;
  setMenuGroup: Dispatch<SetStateAction<MenuGroup>>;
}

const MenuContext = createContext<MenuContextProps | null>(null);

export const MenuController: FC = ({ children }) => {
  // Use `shop` as the default menu group
  const [menuGroup, setMenuGroup] = useState<MenuGroup>("shop");

  return (
    <MenuContext.Provider value={{ menuGroup, setMenuGroup }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuController = () => {
  const { open, setIsOpen } = useModalController("menu");
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error(
      "`useMenuController` must be used inside a `MenuController`"
    );
  }

  const { menuGroup, setMenuGroup } = context;

  return {
    menuGroup,
    open,
    setIsOpen: (open: boolean, menuGroup?: MenuGroup) => {
      setIsOpen(open);
      if (menuGroup) setMenuGroup(menuGroup);
    },
  };
};

const headingWrapperStyle = s((t) => ({
  marginBottom: [t.spacing.md, null, null, t.spacing.xl],
  ...px([t.spacing.lg, null, t.spacing.xl, t.spacing.xxl]),
}));

const headingTextStyle = s(bodyTextExtraSmall, (t) => ({
  borderBottom: "1px solid currentColor",
  paddingBottom: t.spacing.xxs,
}));

export const MenuDrawer: FC<ComponentStyleProps> = ({ _css = {} }) => {
  const { t } = useLocale();
  const { menuGroup, open, setIsOpen } = useMenuController();

  const { data, loading } = useQuery<CollectionData<ProductCore>>(
    COLLECTION_NAVIGATION
  );

  if (loading) {
    const error = new Error(
      "Missing global product data - make sure the `COLLECTION_NAVIGATION` query has been pre-populated during `getStaticProps`"
    );

    if (process.env.NODE_ENV === "production") {
      captureException(error);
    } else if (process.env.NODE_ENV !== "test") {
      throw error;
    }

    return null;
  }

  if (!data) {
    throw new Error("Missing global product data");
  }

  const {
    collection: { products },
  } = data;

  return (
    <Modal
      _css={s(
        (t) => ({
          backgroundColor: t.color.background.dark,
          color: t.color.text.light.base,
          maxWidth: [null, 500, null, 640, 720],
          minWidth: "40%",
        }),
        _css
      )}
      label={t<string>("common:navigation.menu")}
      open={open}
      onClose={() => setIsOpen(false)}
      seo
      type={ModalType.DRAWER}
    >
      <button
        css={s((t) => ({
          padding: t.spacing.md,
          position: "absolute",
          right: 0,
          top: 0,
        }))}
        onClick={() => setIsOpen(false)}
      >
        <Icon
          _css={s({ width: 32 })}
          path={drawerClose}
          title={t("common:close")}
          viewBox="0 0 32 32"
        />
      </button>
      <div
        css={s({
          display: "flex",
          flexDirection: "column",
          height: "100%",
        })}
      >
        <div
          css={s((t) => ({
            flexGrow: 1,
            marginTop: t.spacing.xxl,
            paddingBottom: t.spacing.lg,
          }))}
        >
          {/* Mobile Menu contents  */}
          <motion.dl
            css={s({ display: [null, null, "none"] })}
            variants={menuContainerMobile}
            animate={open ? "visible" : "hidden"}
            initial="hidden"
          >
            <motion.dt css={s(headingWrapperStyle)} variants={items}>
              <span css={s(headingTextStyle)}>
                {t("common:navigation.shop")}
              </span>
            </motion.dt>
            {products.edges.map(({ node }) => (
              <motion.dd
                css={s((t) => ({ marginBottom: t.spacing.xs }))}
                key={node.id}
                variants={items}
              >
                <Link
                  css={s((t) => ({
                    display: "inline-block",
                    ...px(t.spacing.lg),
                    ...py(t.spacing.xs),
                  }))}
                  onClick={() => trackSelectItemEvent(node, "Menu")}
                  to={`/products/${node.handle}`}
                >
                  <span
                    css={s(headingCharlie, (t) => ({
                      display: "block",
                      marginBottom: [0, null, t.spacing.xs],
                    }))}
                  >
                    {node.title}
                  </span>
                  {node.subtitle?.value && (
                    <p
                      css={s(bodyTextSmall, (t) => ({
                        display: "block",
                        fontFamily: t.font.secondary.family,
                        fontStyle: "italic",
                      }))}
                    >
                      {node.subtitle.value}
                    </p>
                  )}
                </Link>
              </motion.dd>
            ))}

            <motion.dd
              css={s((t) => ({
                marginTop: t.spacing.xxs,
              }))}
              variants={items}
            >
              <Link
                css={s(headingCharlie, (t) => ({
                  display: "inline-block",
                  ...px(t.spacing.lg),
                  ...py(t.spacing.xs),
                }))}
                to="/collections/treats"
              >
                {t("common:navigation.treats")}
              </Link>
            </motion.dd>

            <motion.dd variants={items}>
              <a
                css={s((t) => ({
                  display: "inline-block",
                  ...px(t.spacing.lg),
                  ...py(t.spacing.xs),
                }))}
                href={THEMES_ENGINE.urls.account}
                target="_blank"
                rel="noreferrer"
              >
                <span
                  css={s(headingCharlie, (t) => ({
                    display: "block",
                    marginBottom: [0, null, t.spacing.xs],
                  }))}
                >
                  {t(`common:navigation.account`)}
                </span>
              </a>
            </motion.dd>

            <div css={s((t) => ({ marginTop: t.spacing.lg }))}>
              <motion.dt css={s(headingWrapperStyle)} variants={items}>
                <span css={s(headingTextStyle)}>
                  {t("common:navigation.science")}
                </span>
              </motion.dt>
              {[
                { handle: "/science", label: "approach" },
                { handle: "/science/ingredients", label: "ingredients" },
                { handle: "/science/evidence", label: "evidence" },
                { handle: "/science/experts", label: "experts" },
                {
                  handle: "/science/testing-and-transparency",
                  label: "testing",
                },
              ].map(({ handle, label }, idx) => (
                <motion.dd
                  css={s((t) => ({
                    marginTop: idx !== 0 ? t.spacing.xxs : undefined,
                  }))}
                  key={label}
                  variants={items}
                >
                  <Link
                    css={s(headingCharlie, (t) => ({
                      display: "inline-block",
                      ...px(t.spacing.lg),
                      ...py(t.spacing.xs),
                    }))}
                    to={handle}
                  >
                    {t(`common:navigation.${label}`)}
                  </Link>
                </motion.dd>
              ))}
            </div>

            <div css={s((t) => ({ marginTop: t.spacing.lg }))}>
              <motion.dt css={s(headingWrapperStyle)} variants={items}>
                <span css={s(headingTextStyle)}>
                  {t("common:navigation.about")}
                </span>
              </motion.dt>
              {[
                { handle: "/mission", label: "story" },
                { handle: "/mission/supporting-shelters", label: "shelters" },
                { handle: "/mission/sustainability", label: "sustainability" },
                { handle: "/reviews", label: "reviews" },
                {
                  handle: "/reviews/video-testimonials",
                  label: "testimonials",
                },
              ].map(({ handle, label }, idx) => (
                <motion.dd
                  css={s((t) => ({
                    marginTop: idx !== 0 ? t.spacing.xxs : undefined,
                  }))}
                  key={label}
                  variants={items}
                >
                  <Link
                    css={s(headingCharlie, (t) => ({
                      display: "inline-block",
                      ...px(t.spacing.lg),
                      ...py(t.spacing.xs),
                    }))}
                    to={handle}
                  >
                    {t(`common:navigation.${label}`)}
                  </Link>
                </motion.dd>
              ))}
            </div>

            <div css={s((t) => ({ marginTop: t.spacing.lg }))}>
              <motion.dt css={s(headingWrapperStyle)} variants={items}>
                <span css={s(headingTextStyle)}>
                  {t("common:navigation.learn")}
                </span>
              </motion.dt>
              {[
                { handle: "/blog", label: "articles" },
                { handle: "/help/faq", label: "faq" },
                { handle: "/help/for-veterinarians", label: "vet" },
                {
                  handle: "/learn/key-steps-to-make-a-happier-healthier-dog",
                  label: "education",
                },
              ].map(({ handle, label }, idx) => (
                <motion.dd
                  css={s((t) => ({
                    marginTop: idx !== 0 ? t.spacing.xxs : undefined,
                  }))}
                  key={label}
                  variants={items}
                >
                  <Link
                    css={s(headingCharlie, (t) => ({
                      display: "inline-block",
                      ...px(t.spacing.lg),
                      ...py(t.spacing.xs),
                    }))}
                    to={handle}
                  >
                    {t(`common:navigation.${label}`)}
                  </Link>
                </motion.dd>
              ))}
              <motion.dd
                css={s((t) => ({
                  marginTop: t.spacing.xxs,
                }))}
                variants={items}
              >
                <a
                  css={s((t) => ({
                    display: "inline-block",
                    ...px(t.spacing.lg),
                    ...py(t.spacing.xs),
                  }))}
                  href="https://unconditionallovestories.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    css={s(headingCharlie, (t) => ({
                      display: "block",
                      marginBottom: [0, null, t.spacing.xs],
                    }))}
                  >
                    {t(`common:navigation.uls.label`)}
                  </span>
                  <p
                    css={s(bodyTextSmall, (t) => ({
                      fontFamily: t.font.secondary.family,
                      fontStyle: "italic",
                    }))}
                  >
                    {t(`common:navigation.uls.subtitle`)}
                  </p>
                </a>
              </motion.dd>
            </div>
          </motion.dl>

          {/* Desktop menu */}
          <motion.dl
            css={s({ display: ["none", null, "block"] })}
            variants={menuContainerDesktop}
            animate={open ? "visible" : "hidden"}
            initial="hidden"
          >
            {menuGroup === "shop" && (
              <>
                <motion.dt css={s(headingWrapperStyle)} variants={items}>
                  <span css={s(headingTextStyle)}>
                    {t("common:navigation.shop")}
                  </span>
                </motion.dt>

                {products.edges.map(({ node }) => (
                  <motion.dd
                    css={s((t) => ({ marginBottom: t.spacing.xs }))}
                    key={node.id}
                    variants={items}
                  >
                    <Link
                      css={s((t) => ({
                        display: "inline-block",
                        ...px([null, null, t.spacing.xl, t.spacing.xxl]),
                        ...py(t.spacing.xs),
                      }))}
                      onClick={() => trackSelectItemEvent(node, "Menu")}
                      to={`/products/${node.handle}`}
                    >
                      <span
                        css={s(headingBravo, (t) => ({
                          display: "block",
                          fontSize: [36, null, null, 42, 48],
                          marginBottom: t.spacing.xs,
                        }))}
                      >
                        {node.title}
                      </span>
                      {node.subtitle?.value && (
                        <p
                          css={s((t) => ({
                            display: "block",
                            fontFamily: t.font.secondary.family,
                            fontStyle: "italic",
                            marginBottom: t.spacing.md,
                          }))}
                        >
                          {node.subtitle?.value}
                        </p>
                      )}
                    </Link>
                  </motion.dd>
                ))}

                <motion.dd
                  css={s((t) => ({ marginBottom: t.spacing.md }))}
                  variants={items}
                >
                  <Link
                    css={s(headingBravo, (t) => ({
                      display: "block",
                      fontSize: [36, null, null, 42, 48],
                      ...px([null, null, t.spacing.xl, t.spacing.xxl]),
                      ...py(t.spacing.xs),
                    }))}
                    to="/collections/treats"
                  >
                    {t("common:navigation.treats")}
                  </Link>
                </motion.dd>

                <motion.dd
                  css={s((t) => ({ marginBottom: t.spacing.md }))}
                  variants={items}
                >
                  <a
                    css={s(headingBravo, (t) => ({
                      display: "block",
                      fontSize: [36, null, null, 42, 48],
                      ...px([null, null, t.spacing.xl, t.spacing.xxl]),
                      ...py(t.spacing.xs),
                    }))}
                    href={THEMES_ENGINE.urls.account}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(`common:navigation.account`)}
                  </a>
                </motion.dd>
              </>
            )}

            {menuGroup === "science" && (
              <>
                <motion.dt css={s(headingWrapperStyle)} variants={items}>
                  <span css={headingTextStyle}>
                    {t("common:navigation.science")}
                  </span>
                </motion.dt>
                {[
                  { handle: "/science", label: "approach" },
                  { handle: "/science/ingredients", label: "ingredients" },
                  { handle: "/science/evidence", label: "evidence" },
                  { handle: "/science/experts", label: "experts" },
                  {
                    handle: "/science/testing-and-transparency",
                    label: "testing",
                  },
                ].map(({ handle, label }) => (
                  <motion.dd
                    css={s((t) => ({ marginBottom: t.spacing.xxs }))}
                    key={label}
                    variants={items}
                  >
                    <Link
                      css={s(headingBravo, (t) => ({
                        display: "inline-block",
                        fontSize: [36, null, null, 42, 48],
                        ...px([t.spacing.xl, null, null, t.spacing.xxl]),
                        ...py([t.spacing.sm, null, null, t.spacing.md]),
                      }))}
                      to={handle}
                    >
                      {t(`common:navigation.${label}`)}
                    </Link>
                  </motion.dd>
                ))}
              </>
            )}

            {menuGroup === "about" && (
              <>
                <motion.dt css={s(headingWrapperStyle)} variants={items}>
                  <span css={headingTextStyle}>
                    {t("common:navigation.about")}
                  </span>
                </motion.dt>
                {[
                  { handle: "/mission", label: "story" },
                  { handle: "/mission/supporting-shelters", label: "shelters" },
                  {
                    handle: "/mission/sustainability",
                    label: "sustainability",
                  },
                  { handle: "/reviews", label: "reviews" },
                  {
                    handle: "/reviews/video-testimonials",
                    label: "testimonials",
                  },
                ].map(({ handle, label }) => (
                  <motion.dd
                    css={s((t) => ({ marginBottom: t.spacing.xxs }))}
                    key={label}
                    variants={items}
                  >
                    <Link
                      css={s(headingBravo, (t) => ({
                        display: "inline-block",
                        fontSize: [36, null, null, 42, 48],
                        ...px([t.spacing.xl, null, null, t.spacing.xxl]),
                        ...py([t.spacing.sm, null, null, t.spacing.md]),
                      }))}
                      to={handle}
                    >
                      {t(`common:navigation.${label}`)}
                    </Link>
                  </motion.dd>
                ))}
              </>
            )}

            {menuGroup === "learn" && (
              <>
                <motion.dt css={s(headingWrapperStyle)} variants={items}>
                  <span css={headingTextStyle}>
                    {t("common:navigation.learn")}
                  </span>
                </motion.dt>
                {[
                  { handle: "/blog", label: "articles" },
                  { handle: "/help/faq", label: "faq" },
                  { handle: "/help/for-veterinarians", label: "vet" },
                  {
                    handle: "/learn/key-steps-to-make-a-happier-healthier-dog",
                    label: "education",
                  },
                ].map(({ handle, label }) => (
                  <motion.dd
                    css={s((t) => ({ marginBottom: t.spacing.xxs }))}
                    key={label}
                    variants={items}
                  >
                    <Link
                      css={s(headingBravo, (t) => ({
                        display: "inline-block",
                        fontSize: [36, null, null, 42, 48],
                        ...px([t.spacing.xl, null, null, t.spacing.xxl]),
                        ...py([t.spacing.sm, null, null, t.spacing.md]),
                      }))}
                      to={handle}
                    >
                      {t(`common:navigation.${label}`)}
                    </Link>
                  </motion.dd>
                ))}
                <motion.dd
                  css={s((t) => ({ marginBottom: t.spacing.xxs }))}
                  variants={items}
                >
                  <a
                    css={s((t) => ({
                      display: "inline-block",
                      ...px([t.spacing.xl, null, null, t.spacing.xxl]),
                      ...py([t.spacing.sm, null, null, t.spacing.md]),
                    }))}
                    href="https://unconditionallovestories.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span
                      css={s(headingBravo, (t) => ({
                        display: "block",
                        fontSize: [36, null, null, 42, 48],
                        marginBottom: t.spacing.xs,
                      }))}
                    >
                      {t(`common:navigation.uls.label`)}
                    </span>
                    <p
                      css={s((t) => ({
                        fontFamily: t.font.secondary.family,
                        fontStyle: "italic",
                        marginBottom: 0,
                      }))}
                    >
                      {t(`common:navigation.uls.subtitle`)}
                    </p>
                  </a>
                </motion.dd>
              </>
            )}
          </motion.dl>
        </div>
        <motion.div
          animate={{ opacity: 1 }}
          css={s({ flexShrink: 1, opacity: 0 })}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SocialIcons
            _css={s((t) => ({
              paddingBottom: t.spacing.xl,
              ...px([t.spacing.lg, null, t.spacing.xl, t.spacing.xxl]),
            }))}
          />
        </motion.div>
      </div>
    </Modal>
  );
};

export const MenuButton: FC = () => {
  const { t } = useLocale();
  const { setIsOpen } = useMenuController();

  return (
    <button
      css={s((t) => ({
        display: ["flex", null, "none"],
        outline: "none",
        padding: t.spacing.sm,
      }))}
      onClick={() => setIsOpen(true)}
    >
      <Icon
        _css={s({ width: 22 })}
        path={burgerMenu}
        title={t("common:navigation.menu")}
        viewBox="0 0 20 14"
      />
    </button>
  );
};
