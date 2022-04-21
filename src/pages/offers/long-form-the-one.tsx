import { runServerSideQuery } from "@sss/apollo";
import { ProductSchema } from "@sss/ecommerce";
import { getProductComputedMetadata } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { CUSTOMIZATION, toCustomizationDictionary } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { Trans } from "react-i18next";
import Accordion from "src/ui/base/accordion";
import { Grid, Item } from "src/ui/base/grid";
import Hero from "src/ui/base/hero";
import Logo from "src/ui/base/logo";
import ResponsiveImage from "src/ui/base/responsive-image";
import {
  bodyText,
  bodyTextStatic,
  headingAlpha,
  headingBravo,
  headingCharlie,
  headingEcho,
} from "src/ui/base/typography";
import book from "src/ui/icons/book";
import chartMag from "src/ui/icons/chartMag";
import protect from "src/ui/icons/defend";
import usFlag from "src/ui/icons/usFlag";
import BenefitsGridCustom from "src/ui/modules/offers/benefits-grid-custom";
import Guarantee from "src/ui/modules/offers/guarantee";
import Stars from "src/ui/modules/reviews/stars";

import {
  belt,
  beltTight,
  greedy,
  gutter,
  gutterBottom,
  gutterTop,
  gutterX,
  gutterY,
  mx,
  navigationTarget,
  percentage,
  px,
  py,
  ResponsiveCSSValue,
  s,
  size,
  useTheme,
} from "@/common/ui/utils";

import BULLDOG_IMG from "../../assets/images/mission/BULLDOG.jpg";
import BROWNDOG_IMG from "../../assets/images/offers/BROWNDOG.jpg";
import SHIPPING_CIRCLE_IMG from "../../assets/images/offers/icons/circle/DELIVERY.png";
import GMO_CIRCLE_IMG from "../../assets/images/offers/icons/circle/GMO.png";
import LAB_CIRCLE_IMG from "../../assets/images/offers/icons/circle/LAB.png";
import PROVEN_CIRCLE_IMG from "../../assets/images/offers/icons/circle/PROVEN.png";
import RISKFREE_CIRCLE_IMG from "../../assets/images/offers/icons/circle/RISKFREE.png";
import VETS_CIRCLE_IMG from "../../assets/images/offers/icons/circle/VET.png";
import DELIVER_IMG from "../../assets/images/offers/icons/deliver.png";
import FACILITIES_IMG from "../../assets/images/offers/icons/facilities.png";
import LOVED_IMG from "../../assets/images/offers/icons/loved.png";
import NATURAL_IMG from "../../assets/images/offers/icons/natural.png";
import RISKFREE_IMG from "../../assets/images/offers/icons/riskfree.png";
import WORRYFREE_IMG from "../../assets/images/offers/icons/worryfree.png";
import EXPERT_IMG from "../../assets/images/offers/JAMIE.jpg";
import LAB_IMG from "../../assets/images/offers/LAB.jpg";
import LICK_IMG from "../../assets/images/offers/LICK.jpg";
import OG_IMG from "../../assets/images/offers/open-graph/THE_ONE_EXPERT_LEAD.jpg";
import OWNER_IMG from "../../assets/images/offers/OWNER.jpg";
import SPOON_IMG from "../../assets/images/offers/SPOON.jpg";
import INTRO_IMG from "../../assets/images/offers/THE_ONE_INTRO.jpg";
import TINS_IMG from "../../assets/images/offers/THE_ONE_TINS.jpg";
import {
  makeProductPageStaticPropsGetter,
  ProductPageDataProvider,
  UnifiedProductPageData,
} from "../../cms/product-page";
import banner from "../../ui/base/banner";
import Icon, { iconBackground } from "../../ui/base/icon";
import { decorativeListItem } from "../../ui/base/list";
import { ToastRack } from "../../ui/base/toast";
import cross from "../../ui/icons/cross";
import question from "../../ui/icons/question";
import tick from "../../ui/icons/tick";
import BundlePicker from "../../ui/modules/offers/bundle-picker";
import {
  comparisonItems,
  ComparisonItemType,
  comparisonOtherItems,
  faqArray,
  headerIcons,
  naturalIcons,
  trustedCaption,
  trustedFigure,
  trustedIcons,
} from "../../ui/modules/offers/constants";
import { IngredientsGridCustom } from "../../ui/modules/offers/ingredients-custom";
import ScrollLinkCustom from "../../ui/modules/offers/scrolllink-bundle";
import RecentPurchases from "../../ui/modules/recent-purchases";
import ReviewsCarousel from "../../ui/modules/reviews/carousel";
import SalesFunnelHeader from "../../ui/modules/sales-funnel-header";

const enUsResource = {
  benefits: {
    text:
      "Our leading experts identified the eight most common canine complaints and designed a product to tackle them ALL from just 1 scoop a day Here’s what your pup can expect once they try The One.",
    title: "One Scoop a Day. 8 Amazing Benefits.",
  },
  bundle: {
    subtitle: "FREE SHIPPING ON ALL ORDERS",
    title: "Chose Your Deal - It’s Time To Transform Your Dog’s Life",
  },
  compare: {
    false: "No",
    item: {
      gmo:
        "Non GMO, gluten free, pesticide free and hypoallergenic, and made with love in approved labs in California.",
      mouth:
        "Mouth watering, delicious taste, with flavors made from natural ingredients and botanicals.",
      order:
        "Every order comes with a risk free, no questions asked, zero hassle, 90 DAY GUARANTEE!",
      results: "PAWsome results with 100,000+ happy dogs (and happy owners!)",
      science:
        "Scientifically backed ingredients, vet approved and a proven track record",
      tested:
        "Tested eight times to ensure The One is safe for all dogs aged 1+",
    },
    title:
      "When It Comes To Choosing a Supplement That Will Keep Your Dog Happy & Healthy... There's Just No Comparison",
    true: "Yes",
    unknown: "Unknown",
  },
  compareOther: {
    false: "No",
    item: {
      chemical:
        "May have a sour or chemical taste that puts your dog off their dinner.",
      dirty:
        "May contain dirty ingredients that perhaps have a negative effect on your dog’s internal organs",
      guarantee:
        "Does not offer a guarantee because the company may not stand by their products or results.",
      metals: "Can be packed with fillers, heavy metals and pesticides",
      reg:
        "May be manufactured in countries with less regulations, possibly making them unsafe.",
      transparency:
        "Lack of transparency when it comes to happy customers and results",
      unproven: "Can be unproven and not based on science.",
    },
    others: "Other dog supplements",
    text:
      "Many supplement companies source their ingredients indirectly from low-cost, low-quality suppliers. We’re taking the opposite approach, and in time, we hope others will follow.",
    title: "The Competition",
    true: "Yes",
    unknown: "Unknown",
  },
  enjoy: {
    list: {
      item1:
        "Allows dogs to enjoy higher levels of energy with reduced levels of anxiety to help conquer their fear.  ",
      item2:
        "Safe, chemical free, Non GMO, no artificial colors or flavors, hypoallergenic and made with clinically proven ingredients. ",
      item3:
        "Save yourself money and sleepless nights by focusing on the very best preventative support for your dog.",
      item4: "Try for FREE: Enjoy a 90 day, Risk Free Trial, on us.",
    },
    review: {
      quote:
        "I thought I would try it and I was extremely happy with the results in a short amount of time. My dog loves it on his chicken he gets for dinner every day",
      quotee: "James M",
    },
    text1:
      "<p>Imagine eating your favorite meal, but it was also packed with the exact blend of powerful, natural ingredients to keep you happy, healthy and in peak performance... this is what your dog can have every day.</p>",
    text2:
      "<p><b>By treating your beloved pet to The One, they can enjoy the endless benefits of preventative support</b></p><p>Help support your dog’s energy and exercise by soothing joint Discomfort, and improving their mobility to get the most out of their life.</p><p>Soothes irritation and itchiness that can result in raw red skin and paw licking, to give your pooch more comfort, while supporting a beautiful shiny coat.</p><p>Only the purest and clinically approved ingredients to ensure The One is of the highest quality for dogs wanting to live their best lives.</p>",
    title:
      "With The One You Can Enjoy The Benefits of Seeing Your Pup Happier and Healthier Than Ever.",
  },
  expert: {
    quote:
      "These supplements are an excellent way to provide your dog with additional benefits that go beyond a healthy diet.",
    quotee:
      "Dr Jamie Peyton, Chief of Integrative Medicine, University of California",
    title: "Leading Vets & Animal Experts Can't Stop Praising The One",
  },
  faqs: {
    item1: {
      answer:
        "<p>1 in 2 supplements only contain half the active ingredients they claim — so we know a lot of products aren’t doing the job!</p><p>They’re often loaded with “filler ingredients” that make up almost 50% of regular supplements to make them appear heavy and nutritious.</p><p>We do things differently.</p><p>The One is unique because it is a sprinkle supplement, not a chew. Unlike chews, it contains only active, clinically proven ingredients, with NO fillers. </p><p>Plus, our formula is backed by a science board to help aid itching, joint issues, dental problems, anxiety, and more - with no unnecessary, harmful extras.</p><p>We’re so confident that The Ones’ ingredients are proven to work …</p><p>That we’re giving you a 90-Day Risk Free trial.</p>",
      question: "Why should I choose The One over another supplement? ",
    },
    item2: {
      answer:
        "<p>Our supplements are carefully balanced with your dog’s weight in mind. We always recommend sticking to the suggested once-daily dose.</p><p>In the event that your dog accidentally consumes more than the daily recommended dose, consult your vet for advice.</p>",
      question: "Is there any risk of my dog overdosing on this supplement? ",
    },
    item3: {
      answer:
        "<p>That’s a good question. </p><p>While our supplements are blended with nutritious broth-like flavoring that’s been proven to be very palatable to dogs, we also understand that each dog's tastes are as unique as their personality.</p><p>So in the highly unlikely event, they don't love the taste, you're fully covered by our 90-day money-back guarantee.</p>",
      question: "Will my dog like the taste? ",
    },
    item4: {
      answer:
        "<p>Yes!</p><p>Along with being gluten-free, pesticide-free, and non-GMO.</p><p>All of our supplements are either allergen-free or hypoallergenic.</p>",
      question: "Are the supplements Allergy-Free?",
    },
    item5: {
      answer:
        "<p>Results vary from dog to dog. However, many of our happy customers see noticeable changes in their dog in as little as 6 weeks.</p><p>You may notice things like:-</p><p>More energy levels, less itching, fewer allergies, fresher breath, and more.</p>",
      question: "How long until I can see results for my dog? ",
    },
    item6: {
      answer:
        "<p>Not if your dogs are happy with their food already.</p><p>The One Supplement is in a powder form and can be sprinkled over your dog's favorite meal with just one scoop.</p><p>No need to buy different food.</p>",
      question: "Do I need to buy different food?  ",
    },
    item7: {
      answer:
        "<p>Sprinkle the recommended number of scoops onto your dog’s food once a day or mix it in with one of their favorite healthy snacks.</p>",
      question: "How do I use the one?   ",
    },
    item8: {
      answer:
        "<p>US Shipping is free for all orders over $25.</p><p>After ordering, you can expect your package to arrive within 3to 5 business days on all domestic orders.</p>",
      question: "Is Shipping free? ",
    },
    item9a: {
      answer:
        "<p>If change your mind or your dog isn’t a fan of their supplement, we’ll refund your order in full.</p><p>Just email us at <Email>hello@fotp.com<Email> within 90 days of receiving your order and a member of our customer service team will advise you how to return the product. You will be responsible for the costs of returning the product back to us.</p><p>Alternatively, we can offer a 30% refund (at our discretion) if you wish to keep the product and share with friends or family.</p>",
      question: "How does the risk-free guarantee work? ",
    },
    item9b: {
      answer:
        "<p>The One is always in demand! We ring-fence stock for our existing customers and subscribers, so the best way to ensure your dog never goes without is to join our subscription programme.</p><p>If we do run out of stock, pre-order service also gives you the chance to be first in line and secure items for yourself before we even have them in stock. This ensures that as soon as they come in we can send your way straight away!</p>",
      question: "How long will The One be available?",
    },
    item9c: {
      answer:
        "<p>We know our supplements DO look and smell great...</p><p>But unfortunately The One has been specifically formulated for canine consumption and we do not recommend that humans take it.</p>",
      question: "Can I Eat My Dog's Supplement? ",
    },
    title: "Why Should I Choose The One?",
  },
  headerIcons: {
    item1: "Easy to deliver – Scoop & serve",
    item2: "Natural, delicious ingredients",
    item3: "Try it risk FREE - happy dog guarantee",
    item4: "Manufactured in clinically approved facilities",
    item5: "Loved by 100k+ dog parents",
    item6: "Worry FREE - safe for all dogs aged 1+",
    title:
      "'The One' from Front of the Pack is the natural way to give your dog the gift of health, happiness and vitality every single day",
  },
  industry: {
    caption: "Trusted by 100,000+ Dog Parents",
    text:
      "<p>The petcare industry is riddled with outdated solutions that simply don't target the most common problems from, itching, gut issues, joint pain, and many more.</p> <p>Many dog nutrition brands claim to fix these issues, only to be little more than an expensive treat and most canine products such as multivitamin chews are normally packed full of filler ingredients that have no benefits for your dog.</p><p>Even worse... many supplements contain HALF of the active ingredients as they claim.</p><p>That's why we ve gone above and beyond to create a product with 12 clinically approved ingredients that offer 8 amazing health benefits.</p><p>No hidden nasties and no additives. Just a delicious powder blend even the fussiest of dogs will LOVE, that can simply be sprinkled over their food at every meal.</p><p>Plus, we test each ingredient rigorously to ensure the absolute safety and best quality for your furry friend, with just one scoop.</p>",
    title: "Most off-the-shelf dog supplements don't solve The problem",
  },
  ingredients:
    "Experience The Power of 12 Natural, Safe, And Clinically Backed Ingredients You Can Trust.",
  meta: {
    description:
      "Fight joint discomfort, itchy skin, smelly breath, anxiety, digestive issues & boost immunity with The One. Eight essential benefits in one daily supplement.",
    openGraph: {
      description: "Eight essential benefits in one daily dog supplement. ",
      title: "8 Targeted Health Benefits In 1 Daily Dog Supplement",
    },
    title: "8 Targeted Health Benefits In 1 Daily Dog Supplement | FOTP",
  },
  naturalIcons: {
    item1: "Proven, Chemical free ingredients",
    item2: "90-Day Risk Free Trial",
    item3: "GMO Free",
    item4: "Backed by leading vets",
    item5: "Independently Lab Tested",
    item6: "Free Shipping",
    title:
      "The One from Front of the Pack is the natural way to give your dog the gift of health, happiness and vitality every single day",
  },
  powerful: {
    caption: "Trusted by 100,000+ Dog Parents",
    subtitle:
      "If you want to calm your dogs nerves, skin, joints, digestion and more...",
    text:
      "Developed by our Science Advisory Board, with leading experts in biochemistry, immunology, animal nutrition and veterinary science. This means some of the brightest minds in canine health ensure The One supplement keeps your pooch at the front of the pack. But don’t just take out word for it...",
    title:
      "The One is the most powerful supplement to support the wellbeing of your pup",
  },
  reviews: {
    title: "Customer reviews",
  },
  risk: {
    caption: "Try RISK FREE. ",
    text:
      "<p><b>If your dog doesn't love The One, you don't pay!</b></p><p>We're so confident that your dog will see an improvement in their skin, stress levels, digestion, mobility and overall immunity, that we’re putting our money where our paw is. </p><p>In the unlikely event that you’re not completely happy with The One, no problem simply send it back to us within 90 days and we’ll refund 100% of your money, no questions asked.</p><p>How can we be so confident? Because The One product has already been used by tens of thousands of happy dog owners who are excited to share their furry friends improvements. </p><p>However, we do understand that dogs are all different. That’s why if you happen to fall in the small group of people who do not experience the benefits of The One for your dog, then send us an email and return your order in 90 days, and we will refund your investment, every single penny, and won’t hold it against you. </p><p>This means you can take advantage of our 90 day risk free trial. </p><p>You have nothing to lose.</p><p>So go ahead...</p><p>Treat your dog to The One today:</p>",
    title:
      "Every Order Comes With Our No Questions Asked, 90-Day Money Back GUARANTEE!",
  },
  stock: {
    caption: "WARNING",
    item1:
      "Unprecedented demand since The One was featured in some of the world’s leading media outlets",
    item2: "Ingredient shipment delays due to the pandemic",
    item3: "The lengthy process of testing our final product eight times",
    item4: "Quality controls and maintaining the purity standards",
    item5:
      "Thousands of smart customers taking advantage of our 90 day risk free trial",
    text1:
      "<p>The One is currently in stock and we work hard to maintain good supply levels.</p><p>However, our stock levels may be impacted by:</p>",
    text2:
      "<p>We ring-fence future supply for our valued existing customers to make sure they never run out.</p><p>Imagine running out of The One right after your dog started seeing serious improvements in their skin and coat, energy, zest for life, mobility and happiness.</p><p>Your dog could quickly struggle under the “canine dark cloud” where they feel low, uncomfortable, unhealthy and are lacking the ingredients they need to live a bouncing, joyful existence.</p><p>That’s why we highly recommend getting the 6-month supply package... just to be on the safe side.</p><p><b>And on this website ONLY you can get it for only $31.99 per pouch (saving 20%...you will find this nowhere else!)</b></p>",
    title: "IMPORTANT STOCK ANNOUNCEMENT",
  },
  topper: {
    list: {
      item1: "Hip & Joint Stiffness",
      item2: "Stress & Anxiety",
      item3: "Digestion Issues",
      item4: "Itchy Skin & Allergies",
      item5: "Bad Breath & Plaque build up",
      item6: "Less than optimal Immune Health",
      title: "But we know many dogs struggle with:",
    },
    text1:
      "<p>Because dogs are like family...</p><p>They mean the world to us, and as pet owners, we want to know they’re enjoying their doggy years to the fullest.</p><p>After all, it can be heartbreaking to see your pooch limping, itching, battling allergies, and not as energetic as they used to be...</p><p>We want them to play, enjoy the outdoors and live their best lives.</p>",
    text2:
      "<p>Thankfully, trusted veterinarians say most of these common issues are preventable with the right support. </p><p>So giving your dog an all in one supplement to tackle each and every potential problem wouldn't just make them healthier and happier. It'd be kinder on your wallet, too!</p><p>The One is only packed with pure, rigorously tested, high-quality ingredients for your best friend. Giving owners complete peace of mind their dog is benefiting in 8 amazing ways! From immune support, heart and brain health, to improved energy, and more.</p><p>Even better, the ingredients in The One are backed by 481 research studies and a Science Advisory Board of experts. Including two leading Vets, a Biochemist, and an Animal Health Nutritionist with over 100 years of combined pet health expertise!</p><p>We understand you want the best for their pets, and that feeding them a diet that supports all elements of their health is important.</p><p>After all, it can be heartbreaking to see your dog itch and scratch every single day, or struggle to get in and out of the car.</p>",
    title:
      "The One Is A Tasty Food Topper Derived From Natural Ingredients To Help Your Pooch Live Its Best Life...",
  },
  trusted: {
    caption: "A Scoop of Vitality From Top to Tail!",
    cta: "Order now",
    stat1:
      "Clinically proven ingredients delivering powerful health-boosting benefits.",
    stat2:
      "Never any artificial substances, plus proudly chemical & pesticide free",
    stat3:
      "Backed by 481 research studies to help your dog live their best life",
    stat4: "100% made in and shipped from the USA",
    text:
      "The One gives 8 incredible health benefits like less itching, better joint movement, improved digestion & immune health and a calmer, happier more playful dog with just one scoop a day!",
    title:
      "Loved by Owners, Dogs & Vets: The One supplement your dog will ever need",
  },
};

interface ExpertLeadProps {
  data: UnifiedProductPageData;
}

export const LongFormTheOne: FC<ExpertLeadProps> = ({ data }) => {
  const { i18n, locale, t } = useLocale();
  const { query } = useRouter();
  const theme = useTheme();

  const meta = getProductComputedMetadata(data.ecommerce, query, locale);

  const skus = ["FPTO01-PHx3", "FPTO01-PHx2", "FPTO01-PH"];

  i18n.addResourceBundle("en-US", "LongFormTheOne", enUsResource);

  const hasBanner = i18n.exists("LongFormTheOne:banner");

  const headerHeights: ResponsiveCSSValue = [
    theme.height.nav.mobile + (hasBanner ? theme.height.banner.mobile : 0),
    null,
    theme.height.nav.desktop + (hasBanner ? theme.height.banner.desktop : 0),
  ];

  return (
    <ProductPageDataProvider meta={meta} {...data}>
      <Metadata
        description={t("LongFormTheOne:meta.description")}
        title={t("LongFormTheOne:meta.title")}
        openGraph={{
          description: t("LongFormTheOne:meta.openGraph.description"),
          image: OG_IMG.src,
          title: t("LongFormTheOne:meta.openGraph.title"),
        }}
      />

      {hasBanner && <div css={s(banner)}>{t("LongFormTheOne:banner")}</div>}
      <SalesFunnelHeader
        _css={s((t) => ({
          top: hasBanner
            ? [t.height.banner.mobile, null, t.height.banner.desktop]
            : 0,
        }))}
        faqsPath="#faqs"
        shopPath="#bundles"
      />
      <main
        css={s((t) => ({
          "& section div p": { marginBottom: t.spacing.md },
        }))}
      >
        {/* Header */}
        <header
          css={s((t) => ({
            color: t.color.text.dark.base,
            marginTop: headerHeights,
            position: "relative",
            textAlign: ["left", null, "center"],
          }))}
        >
          <div css={s(beltTight)}>
            <div
              css={s((t) => ({
                maxWidth: [null, null, 840],
                paddingLeft: [t.spacing.md, null, null, t.spacing.xxl],
                paddingRight: [t.spacing.md, null, null, t.spacing.lg],
                width: "100%",
              }))}
            >
              <p
                css={s(headingEcho, (t) => ({
                  marginBottom: t.spacing.md,
                  textTransform: "uppercase",
                }))}
              >
                {t("LongFormTheOne:trusted.caption")}
              </p>
              <h1
                css={s(headingAlpha, (t) => ({
                  marginBottom: t.spacing.md,
                  marginRight: t.spacing.xl,
                }))}
              >
                {t("LongFormTheOne:trusted.title")}
              </h1>
              <p
                css={s(bodyTextStatic, (t) => ({
                  marginBottom: t.spacing.md,
                }))}
              >
                {t("LongFormTheOne:trusted.text")}
              </p>
              {trustedIcons && (
                <>
                  <Grid
                    direction={"ltr"}
                    gx={(t) => t.spacing.md}
                    gy={(t) => t.spacing.md}
                    itemWidth={["100%", null, "50%"]}
                  >
                    {[
                      { key: "stat1", path: book },
                      { key: "stat2", path: protect },
                      { key: "stat3", path: chartMag },
                      { key: "stat4", path: usFlag },
                    ].map(({ key, path }) => (
                      <Item key={key}>
                        <figure css={s(trustedFigure)}>
                          <Icon _css={s(size([30, null, 32]))} path={path} />
                          <figcaption css={s(trustedCaption)}>
                            {t(`LongFormTheOne:trusted.${key}`)}
                          </figcaption>
                        </figure>
                      </Item>
                    ))}
                  </Grid>
                </>
              )}
              <ScrollLinkCustom />

              <div
                css={s((t) => ({
                  height: [400, null, 500, 740],
                  marginTop: t.spacing.xl,
                  position: "relative",
                  width: "100%",
                }))}
              >
                <ResponsiveImage
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  quality={80}
                  sizes={{
                    maxWidth: [480, null, 840],
                    width: "100vw",
                  }}
                  src={TINS_IMG}
                />
              </div>
            </div>
          </div>
        </header>

        {/* HEADER Icons */}
        {headerIcons && (
          <section
            css={s(gutter, {
              textAlign: "center",
            })}
          >
            <div css={s(beltTight)}>
              <Grid
                gx={(t) => [0, null, t.spacing.md]}
                gy={(t) => [t.spacing.lg, null, t.spacing.md]}
                itemWidth={[
                  percentage(1 / 2),
                  null,
                  percentage(1 / 3),
                  percentage(1 / 6),
                ]}
              >
                {[
                  { key: "item1", x_icon: DELIVER_IMG },
                  { key: "item2", x_icon: NATURAL_IMG },
                  { key: "item3", x_icon: RISKFREE_IMG },
                  { key: "item4", x_icon: FACILITIES_IMG },
                  { key: "item5", x_icon: LOVED_IMG },
                  { key: "item6", x_icon: WORRYFREE_IMG },
                ].map(({ key, x_icon }) => (
                  <Item key={key}>
                    <figure>
                      <div
                        css={s({
                          margin: "auto",
                          maxWidth: [70, null, 80],
                        })}
                      >
                        <ResponsiveImage
                          alt=""
                          sizes={{
                            maxWidth: [70, null, 80],
                            width: "100vw",
                          }}
                          src={x_icon}
                        />
                      </div>
                      <figcaption
                        css={s(headingEcho, (t) => ({
                          fontWeight: t.font.primary.weight.medium,
                          ...mx([t.spacing.xs, null, t.spacing.xs]),
                          marginTop: [t.spacing.xs, null, t.spacing.sm],
                          wordBreak: "keep-all",
                        }))}
                      >
                        {t(`LongFormTheOne:headerIcons.${key}`)}
                      </figcaption>
                    </figure>
                  </Item>
                ))}
              </Grid>
            </div>
          </section>
        )}

        {/* Reviews */}
        <section
          css={s((t) => ({
            backgroundColor: t.color.tint.moss,
            textAlign: "center",
          }))}
        >
          <div css={s(gutterX, gutterTop, beltTight)}>
            <p
              css={s(headingEcho, (t) => ({
                marginBottom: t.spacing.md,
                textTransform: "uppercase",
              }))}
            >
              {t("LongFormTheOne:powerful.subtitle")}
            </p>
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: t.spacing.md,
              }))}
            >
              {t("LongFormTheOne:powerful.title")}
            </h2>
            <p
              css={s(bodyTextStatic, (t) => ({
                marginBottom: t.spacing.md,
              }))}
            >
              {t("LongFormTheOne:powerful.text")}
            </p>
            <p
              css={s(headingEcho, (t) => ({
                marginBottom: t.spacing.md,
                textTransform: "uppercase",
              }))}
            >
              {t("LongFormTheOne:powerful.caption")}
            </p>
          </div>
          <div css={s(belt)}>
            {data.cms.reviews && <ReviewsCarousel reviews={data.cms.reviews} />}
          </div>
        </section>

        {/* Industry */}
        <section
          css={s(gutter, (t) => ({
            color: t.color.text.dark.base,
            paddingTop: [t.spacing.xxl, null, t.spacing.xl],
            textAlign: "left",
          }))}
        >
          <div css={s(beltTight)}>
            <h2
              css={s(headingAlpha, (t) => ({
                fontSize: [32, 36, 42, 48],
                lineHeight: ["36px", "38px", "48px", "54px"],
                marginBottom: [t.spacing.lg, null, t.spacing.xl],
              }))}
            >
              {t("LongFormTheOne:industry.title")}
            </h2>
            <Trans i18nKey="LongFormTheOne:industry.text" />
            <div
              css={s({
                height: [400, null, 500, 740],
                position: "relative",
                width: "100%",
              })}
            >
              <ResponsiveImage
                alt=""
                layout="fill"
                objectFit="cover"
                quality={75}
                sizes={{
                  maxWidth: [480, null, 840],
                  width: "100vw",
                }}
                src={LAB_IMG}
              />
            </div>
            <ScrollLinkCustom />
          </div>
        </section>

        {/* Gold -  Tasty Food Tooper */}
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.tint.sand,
            color: t.color.text.dark.base,
            paddingTop: [t.spacing.xxl, null, t.spacing.xl],
            position: "relative",
          }))}
        >
          <Hero
            _css={s(greedy, {
              "& > *": {
                ...greedy,
                objectFit: "contain",
                objectPosition: ["70% 580px", "50% 300px", "right 100px"],
                opacity: 0.7,
                overflow: "hidden",
                transform: ["scale(1.8)", "scale(1.2)", "scale(1)"],
              },
              overflow: "hidden",
              zIndex: 1,
            })}
            priority
            quality={60}
            urls={[BULLDOG_IMG.src, null, BULLDOG_IMG.src]}
          />

          <div css={s(belt, { position: "relative", zIndex: 3 })}>
            <div
              css={s((t) => ({
                marginTop: [0, null, t.spacing.xxl],
                maxWidth: [null, null, 840],
                textAlign: "left",
              }))}
            >
              <h2
                css={s(headingAlpha, (t) => ({
                  marginBottom: [t.spacing.md, null, t.spacing.lg],
                }))}
              >
                {t("LongFormTheOne:topper.title")}
              </h2>
              <Trans i18nKey="LongFormTheOne:topper.text1" />
              {/* Decorative List */}
              <div
                css={s((t) => ({
                  color: t.color.text.dark.base,
                }))}
              >
                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  {t("LongFormTheOne:topper.list.title")}
                </p>
                <ul
                  css={s(bodyTextStatic, (t) => ({
                    "& > li": {
                      fontWeight: t.font.primary.weight.bold,
                      paddingBottom: t.spacing.xs,
                    },
                    marginBottom: t.spacing.md,
                  }))}
                >
                  <li css={s(decorativeListItem)}>
                    {t("LongFormTheOne:topper.list.item1")}
                  </li>
                  <li css={s(decorativeListItem)}>
                    {t("LongFormTheOne:topper.list.item2")}
                  </li>
                  <li css={s(decorativeListItem)}>
                    {t("LongFormTheOne:topper.list.item3")}
                  </li>
                  <li css={s(decorativeListItem)}>
                    {t("LongFormTheOne:topper.list.item4")}
                  </li>
                  <li css={s(decorativeListItem)}>
                    {t("LongFormTheOne:topper.list.item5")}
                  </li>
                  <li css={s(decorativeListItem)}>
                    {t("LongFormTheOne:topper.list.item6")}
                  </li>
                </ul>
              </div>
              <div
                css={s((t) => ({
                  height: [400, null, 500, 740],
                  marginBottom: [t.spacing.md, null, t.spacing.lg],
                  position: "relative",
                  width: "100%",
                }))}
              >
                <ResponsiveImage
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  quality={75}
                  sizes={{
                    width: "100vw",
                  }}
                  src={OWNER_IMG}
                />
              </div>
              <Trans i18nKey="LongFormTheOne:topper.text2" />
              <div
                css={s((t) => ({
                  height: [400, null, 500, 740],
                  marginBottom: [t.spacing.md, null, t.spacing.lg],
                  position: "relative",
                  width: "100%",
                }))}
              >
                <ResponsiveImage
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  quality={75}
                  sizes={{
                    width: "100vw",
                  }}
                  src={BROWNDOG_IMG}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Natural Icons */}
        {naturalIcons && (
          <section
            css={s(gutter, {
              textAlign: "center",
            })}
          >
            <div css={s(beltTight)}>
              <h2
                css={s(headingAlpha, (t) => ({
                  marginBottom: t.spacing.xl,
                }))}
              >
                {t("LongFormTheOne:naturalIcons.title")}
              </h2>
              <Grid
                gx={(t) => [t.spacing.md, null, t.spacing.lg]}
                gy={(t) => [t.spacing.lg, null, t.spacing.xl]}
                itemWidth={[percentage(1 / 2), null, null, percentage(1 / 3)]}
              >
                {[
                  { key: "item1", x_icon: PROVEN_CIRCLE_IMG },
                  { key: "item2", x_icon: RISKFREE_CIRCLE_IMG },
                  { key: "item3", x_icon: GMO_CIRCLE_IMG },
                  { key: "item4", x_icon: VETS_CIRCLE_IMG },
                  { key: "item5", x_icon: LAB_CIRCLE_IMG },
                  { key: "item6", x_icon: SHIPPING_CIRCLE_IMG },
                ].map(({ key, x_icon }) => (
                  <Item key={key}>
                    <figure>
                      <div
                        css={s({
                          margin: "auto",
                          maxWidth: [100, null, 140],
                        })}
                      >
                        <ResponsiveImage
                          alt=""
                          quality={75}
                          sizes={{
                            maxWidth: [100, null, 140],
                            width: "100vw",
                          }}
                          src={x_icon}
                        />
                      </div>
                      <figcaption
                        css={s(headingEcho, (t) => ({
                          fontWeight: t.font.primary.weight.medium,
                          marginTop: t.spacing.md,
                        }))}
                      >
                        {t(`LongFormTheOne:naturalIcons.${key}`)}
                      </figcaption>
                    </figure>
                  </Item>
                ))}
              </Grid>

              <div
                css={s((t) => ({
                  height: [400, null, 500, 740],
                  marginTop: t.spacing.xl,
                  position: "relative",
                  width: "100%",
                }))}
              >
                <ResponsiveImage
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  quality={80}
                  sizes={{
                    maxWidth: [480, null, 840],
                    width: "100vw",
                  }}
                  src={TINS_IMG}
                />
              </div>

              <ScrollLinkCustom />
            </div>
          </section>
        )}

        {/* Benefits */}
        <section css={s(gutterBottom, gutterX, { textAlign: "center" })}>
          <div css={s(beltTight)}>
            <h2
              css={s(headingAlpha, (t) => ({
                fontSize: [32, 36, 42, 48],
                lineHeight: ["36px", "38px", "48px", "54px"],
                marginBottom: t.spacing.md,
                ...mx("auto"),
              }))}
            >
              {t("LongFormTheOne:benefits.title")}
            </h2>
            <p
              css={s(bodyText, (t) => ({
                marginBottom: t.spacing.xxl,
                maxWidth: 700,
                ...mx("auto"),
                textAlign: "center",
              }))}
            >
              {t("LongFormTheOne:benefits.text")}
            </p>
            <BenefitsGridCustom />
          </div>
        </section>

        {/* Ingredients */}
        {data.cms.product?.ingredients && (
          <section
            css={s(gutter, (t) => ({
              backgroundColor: t.color.background.feature2,
              textAlign: "center",
            }))}
          >
            <div css={s(belt)}>
              <h2
                css={s(headingAlpha, (t) => ({
                  marginBottom: t.spacing.xxl,
                  maxWidth: ["100%", null, "60%"],
                  ...mx("auto"),
                }))}
              >
                {t("LongFormTheOne:ingredients")}
              </h2>
              <IngredientsGridCustom
                ingredients={data.cms.product.ingredients}
              />
            </div>
          </section>
        )}

        {/* 50/50 Expert */}
        <section css={s(gutterY)}>
          <Grid
            direction={"ltr"}
            gx={theme.spacing.md}
            gy={theme.spacing.xl}
            itemWidth={["100%", null, "50%"]}
          >
            <Item>
              <div
                css={s({
                  display: ["none", null, "block"],
                  height: [null, null, 650],
                  position: "relative",
                  width: "100%",
                })}
              >
                <ResponsiveImage
                  alt=""
                  quality={75}
                  layout="fill"
                  objectFit="cover"
                  sizes={{
                    width: ["100vw", null, "50vw"],
                  }}
                  src={EXPERT_IMG}
                />
              </div>
              <div css={s({ display: [null, null, "none"] })}>
                <ResponsiveImage
                  alt=""
                  height={1110}
                  sizes="100vw"
                  width={1110}
                  src={EXPERT_IMG}
                />
              </div>
            </Item>
            <Item
              _css={s({
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                justifyContent: "center",
                textAlign: "left",
              })}
            >
              <div
                css={s((t) => ({
                  maxWidth: [null, null, 840],
                  paddingLeft: [
                    t.spacing.md,
                    t.spacing.xl,
                    null,
                    t.spacing.xxl,
                    t.spacing.xxxl,
                  ],
                  paddingRight: [t.spacing.md, t.spacing.xl, t.spacing.xxl],
                  width: "100%",
                }))}
              >
                <h2
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.md,
                    marginRight: t.spacing.xl,
                    textAlign: "left",
                  }))}
                >
                  {t("LongFormTheOne:expert.title")}
                </h2>

                <p
                  css={s(bodyTextStatic, (t) => ({
                    marginBottom: t.spacing.md,
                  }))}
                >
                  &quot;{t("LongFormTheOne:expert.quote")}&quot;
                </p>

                <p css={s(headingEcho)}>{t("LongFormTheOne:expert.quotee")}</p>

                <ScrollLinkCustom />
              </div>
            </Item>
          </Grid>
        </section>

        {/* Guarantee */}
        <Guarantee />

        {/* Table FOTP */}
        <section
          css={s(gutterX, gutterBottom, gutterTop, { textAlign: "center" })}
        >
          <div css={s(beltTight)}>
            <h2
              css={s(headingAlpha, (t) => ({
                fontSize: [32, 36, 42, 48],
                lineHeight: ["36px", "38px", "48px", "54px"],
                marginBottom: [t.spacing.sm, t.spacing.md, t.spacing.md],
              }))}
            >
              {t("LongFormTheOne:compare.title")}
            </h2>
          </div>
          <div
            css={s(belt, (t) => ({
              borderColor: t.color.tint.algae,
              borderRadius: t.radius.md,
              borderStyle: "solid",
              borderWidth: [0, 0, 1],
              width: "100%",
              ...px([null, null, t.spacing.xxxl]),
              ...py([null, null, null]),
            }))}
          >
            <table
              css={s({
                tableLayout: "fixed",
                width: "100%",
              })}
            >
              <colgroup>
                <col css={s({ width: "70%" })} span={1} />
                <col css={s({ width: "30%" })} span={1} />
              </colgroup>
              <thead>
                <tr>
                  <td />
                  <th
                    css={s(headingEcho, (t) => ({
                      ...py([null, null, t.spacing.md]),
                      backgroundColor: t.color.background.feature1,
                    }))}
                  >
                    <Logo
                      _css={s({
                        height: [48, null, 60],
                        width: "auto",
                      })}
                      fill="currentColor"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, index) => (
                  <tr
                    css={s((t) => ({
                      borderBottom: `solid 1px ${t.color.tint.algae}`,
                    }))}
                    key={index}
                  >
                    <td
                      css={s(bodyText, (t) => ({
                        fontSize: [14, 16, 18],
                        fontWeight: t.font.primary.weight.medium,
                        ...py(t.spacing.md),
                        paddingRight: t.spacing.md,
                        textAlign: "left",
                        wordWrap: "break-word",
                      }))}
                    >
                      {t(`LongFormTheOne:compare.item.${item.key}`)}
                    </td>
                    <td
                      css={s((t) => ({
                        backgroundColor: t.color.background.feature1,
                        color: t.color.tint.sage,
                        ...py(t.spacing.md),
                      }))}
                    >
                      <div>
                        <div css={s(iconBackground)}>
                          {item?.us === ComparisonItemType.TRUE ? (
                            <Icon
                              _css={s(size([14, null, 16]), { color: "white" })}
                              path={tick}
                              title={t("LongFormTheOne:compare.true")}
                            />
                          ) : (
                            <Icon
                              _css={s(size([14, null, 16]), { color: "white" })}
                              path={question}
                              title={t("LongFormTheOne:compare.unknown")}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  <td
                    css={s((t) => ({
                      ...py([null, null, t.spacing.md]),
                      backgroundColor: [
                        "none",
                        "none",
                        t.color.background.feature1,
                      ],
                      display: ["none", "none", "block"],
                    }))}
                  >
                    &nbsp;
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Table OTHERS */}
        <section css={s(gutterX, gutterBottom, { textAlign: "center" })}>
          <div css={s(beltTight)}>
            <h2
              css={s(headingAlpha, (t) => ({
                fontSize: [32, 36, 42, 48],
                lineHeight: ["36px", "38px", "48px", "54px"],
                marginBottom: [t.spacing.sm, t.spacing.md, t.spacing.md],
              }))}
            >
              {t("LongFormTheOne:compareOther.title")}
            </h2>
          </div>
          <div
            css={s(belt, (t) => ({
              borderColor: t.color.tint.algae,
              borderRadius: t.radius.md,
              borderStyle: "solid",
              borderWidth: [0, 0, 1],
              width: "100%",
              ...px([null, null, t.spacing.xxxl]),
              ...py([null, null, null]),
            }))}
          >
            <table
              css={s({
                tableLayout: "fixed",
                width: "100%",
              })}
            >
              <colgroup>
                <col css={s({ width: "70%" })} span={1} />
                <col css={s({ width: "30%" })} span={1} />
              </colgroup>
              <thead>
                <tr>
                  <td />
                  <th
                    css={s(headingEcho, (t) => ({
                      ...py([null, null, t.spacing.md]),
                      backgroundColor: t.color.tint.moss,
                    }))}
                  />{" "}
                </tr>
              </thead>
              <tbody>
                {comparisonOtherItems.map((item, index) => (
                  <tr
                    css={s((t) => ({
                      borderBottom: `solid 1px ${t.color.tint.algae}`,
                    }))}
                    key={index}
                  >
                    <td
                      css={s(bodyText, (t) => ({
                        fontSize: [14, 16, 18],
                        fontWeight: t.font.primary.weight.medium,
                        ...py(t.spacing.md),
                        paddingRight: t.spacing.md,
                        textAlign: "left",
                        wordWrap: "break-word",
                      }))}
                    >
                      {t(`LongFormTheOne:compareOther.item.${item.key}`)}
                    </td>
                    <td
                      css={s((t) => ({
                        backgroundColor: t.color.tint.moss,
                        color: t.color.tint.sage,
                        ...py(t.spacing.md),
                      }))}
                    >
                      <div>
                        {item.them && item.them === "false" ? (
                          <Icon
                            _css={s(size([18, null, 22]), (t) => ({
                              color: t.color.state.error,
                            }))}
                            path={cross}
                            title={t("LongFormTheOne:compareOther.false")}
                          />
                        ) : (
                          <Icon
                            _css={s(size([14, null, 16]), (t) => ({
                              color: t.color.state.alt,
                            }))}
                            path={question}
                            title={t("LongFormTheOne:compareOther.unknown")}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  <td
                    css={s((t) => ({
                      ...py([null, null, t.spacing.md]),
                      backgroundColor: ["none", "none", t.color.tint.moss],
                      display: ["none", "none", "block"],
                    }))}
                  >
                    &nbsp;
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <div
            css={s(beltTight, (t) => ({
              marginTop: [t.spacing.md, null, null],
            }))}
          >
            <div
              css={s({
                height: [250, null, 610],
                position: "relative",
                width: "100%",
              })}
            >
              <ResponsiveImage
                alt=""
                layout="fill"
                objectFit="contain"
                quality={75}
                sizes={{
                  maxWidth: [480, null, 840],
                  width: "100vw",
                }}
                src={SPOON_IMG}
              />
            </div>
            <ScrollLinkCustom />
          </div>
        </section>

        {/* Enjoy */}
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.dark,
            color: t.color.text.light.base,
            paddingTop: [t.spacing.xxl, null, t.spacing.xl],
            textAlign: ["left", null, "center"],
          }))}
        >
          <div css={s(beltTight)}>
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: t.spacing.md,
              }))}
            >
              {t("LongFormTheOne:enjoy.title")}
            </h2>
            <Trans i18nKey="LongFormTheOne:enjoy.text1" />
            <div
              css={s((t) => ({
                height: [400, null, 500, 740],
                marginBottom: [t.spacing.md, null, t.spacing.lg],
                position: "relative",
                width: "100%",
              }))}
            >
              <ResponsiveImage
                alt=""
                layout="fill"
                objectFit="cover"
                quality={75}
                sizes={{
                  maxWidth: [480, null, 840],
                  width: "100vw",
                }}
                src={LICK_IMG}
              />
            </div>

            <ScrollLinkCustom />
            <Trans i18nKey="LongFormTheOne:enjoy.text2" />

            <ul
              css={s(bodyTextStatic, (t) => ({
                "& > li": {
                  fontWeight: t.font.primary.weight.bold,
                  paddingBottom: t.spacing.xs,
                  textAlign: "left",
                },
                marginBottom: t.spacing.md,
              }))}
            >
              <li css={s(decorativeListItem)}>
                {t("LongFormTheOne:enjoy.list.item1")}
              </li>
              <li css={s(decorativeListItem)}>
                {t("LongFormTheOne:enjoy.list.item2")}
              </li>
              <li css={s(decorativeListItem)}>
                {t("LongFormTheOne:enjoy.list.item3")}
              </li>
              <li css={s(decorativeListItem)}>
                {t("LongFormTheOne:enjoy.list.item4")}
              </li>
            </ul>

            <aside
              css={s((t) => ({
                backgroundColor: t.color.background.base,
                borderRadius: t.radius.lg,
                color: t.color.text.dark.base,
                maxWidth: 400,
                ...mx("auto"),
                padding: t.spacing.sm,
                paddingBottom: t.spacing.xxs,
                textAlign: "left",
              }))}
            >
              <Stars
                _css={s((t) => ({
                  height: 20,
                  marginBottom: t.spacing.md,
                  width: 120,
                }))}
                value={5}
              />
              <p css={s(bodyText)}>
                &quot;{t("LongFormTheOne:enjoy.review.quote")}&quot;
              </p>

              <p css={s(headingEcho)}>
                {t("LongFormTheOne:enjoy.review.quotee")}
              </p>
            </aside>
          </div>
        </section>

        {/* Bundle Picker */}
        <section
          css={s(gutter, gutterBottom, {
            "& form header h2, & form header p": {
              display: "none",
            },
            textAlign: "center",
          })}
          id="bundles"
        >
          <div css={s(beltTight)}>
            <h2
              css={s(headingAlpha, (t) => ({
                fontSize: [32, 36, 42, 48],
                lineHeight: ["36px", "38px", "48px", "54px"],
                marginBottom: [t.spacing.sm, t.spacing.md, t.spacing.md],
              }))}
            >
              {t("LongFormTheOne:bundle.title")}
            </h2>
            <p css={s(headingCharlie)}>{t("LongFormTheOne:bundle.subtitle")}</p>
          </div>
          <BundlePicker skus={skus} trackingSource="long-form" />
        </section>

        {/* Risk Free */}
        <section
          css={s(gutter, gutterBottom, (t) => ({
            backgroundColor: t.color.background.feature6,
            ...py(t.spacing.xl),
            textAlign: "left",
          }))}
        >
          <div css={s(beltTight)}>
            <p css={s(headingAlpha)}>{t("LongFormTheOne:risk.caption")}</p>
            <h2
              css={s(headingBravo, (t) => ({
                marginBottom: t.spacing.md,
              }))}
            >
              {t("LongFormTheOne:risk.title")}
            </h2>
            <Trans i18nKey="LongFormTheOne:risk.text" />
            <div
              css={s((t) => ({
                height: [350, null, 500, 740],
                marginBottom: [t.spacing.md, null, t.spacing.lg],
                position: "relative",
                width: "100%",
              }))}
            >
              <ResponsiveImage
                alt=""
                layout="fill"
                objectFit="cover"
                quality={75}
                sizes={{
                  maxWidth: [480, null, 840],
                  width: "100vw",
                }}
                src={INTRO_IMG}
              />
            </div>
            <ScrollLinkCustom />
          </div>
        </section>

        {/* FAQs */}
        {faqArray && (
          <section
            css={s(gutter, navigationTarget(headerHeights), (t) => ({
              ...py(t.spacing.xl),
            }))}
            id="faqs"
          >
            <div css={s(belt, { maxWidth: 840 })}>
              <h2
                css={s(headingAlpha, (t) => ({
                  fontSize: [32, 36, 42, 48],
                  lineHeight: ["36px", "38px", "48px", "54px"],
                  marginBottom: [t.spacing.xl, null, t.spacing.xxl],
                  textAlign: "center",
                }))}
              >
                {t("LongFormTheOne:faqs.title")}
              </h2>

              <Accordion
                id="faq1"
                label={t("LongFormTheOne:faqs.item1.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item1.answer" />
              </Accordion>
              <Accordion
                id="faq2"
                label={t("LongFormTheOne:faqs.item2.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item2.answer" />
              </Accordion>
              <Accordion
                id="faq3"
                label={t("LongFormTheOne:faqs.item3.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item3.answer" />
              </Accordion>
              <Accordion
                id="faq4"
                label={t("LongFormTheOne:faqs.item4.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item4.answer" />
              </Accordion>
              <Accordion
                id="faq5"
                label={t("LongFormTheOne:faqs.item5.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item5.answer" />
              </Accordion>
              <Accordion
                id="faq6"
                label={t("LongFormTheOne:faqs.item6.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item6.answer" />
              </Accordion>
              <Accordion
                id="faq7"
                label={t("LongFormTheOne:faqs.item7.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item7.answer" />
              </Accordion>
              <Accordion
                id="faq8"
                label={t("LongFormTheOne:faqs.item8.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item8.answer" />
              </Accordion>
              <Accordion
                id="faq9a"
                label={t("LongFormTheOne:faqs.item9a.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item9a.answer" />
              </Accordion>
              <Accordion
                id="faq9b"
                label={t("LongFormTheOne:faqs.item9b.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item9b.answer" />
              </Accordion>
              <Accordion
                id="faq9c"
                label={t("LongFormTheOne:faqs.item9c.question")}
                labelAs="h3"
              >
                <Trans i18nKey="LongFormTheOne:faqs.item9c.answer" />
              </Accordion>
            </div>
          </section>
        )}

        {/* Stock Warning */}
        <section
          css={s(gutter, (t) => ({
            backgroundColor: t.color.background.dark,
            color: t.color.text.light.base,
            ...py(t.spacing.xl),
            textAlign: ["left", null, "center"],
          }))}
        >
          <div css={s(beltTight)}>
            <p
              css={s(headingBravo, (t) => ({
                color: t.color.state.warning,
                marginBottom: t.spacing.xl,
                textAlign: "center",
                textTransform: "uppercase",
              }))}
            >
              {t("LongFormTheOne:stock.caption")}
            </p>
            <h2
              css={s(headingAlpha, (t) => ({
                marginBottom: t.spacing.md,
                textAlign: "center",
              }))}
            >
              {t("LongFormTheOne:stock.title")}
            </h2>

            <Trans i18nKey="LongFormTheOne:stock.text1" />
            <ul
              css={s(bodyTextStatic, (t) => ({
                "& > li": {
                  fontWeight: t.font.primary.weight.bold,
                  paddingBottom: t.spacing.xs,
                  textAlign: "left",
                },
                marginBottom: t.spacing.md,
              }))}
            >
              <li css={s(decorativeListItem)}>
                {t("LongFormTheOne:stock.item1")}
              </li>
              <li css={s(decorativeListItem)}>
                {t("LongFormTheOne:stock.item2")}
              </li>
              <li css={s(decorativeListItem)}>
                {t("LongFormTheOne:stock.item3")}
              </li>
              <li css={s(decorativeListItem)}>
                {t("LongFormTheOne:stock.item4")}
              </li>
              <li css={s(decorativeListItem)}>
                {t("LongFormTheOne:stock.item5")}
              </li>
            </ul>

            <Trans i18nKey="LongFormTheOne:stock.text2" />
            <ScrollLinkCustom />
          </div>
        </section>
      </main>

      <RecentPurchases />
      <ProductSchema product={data.ecommerce} />

      <ToastRack
        _css={s((t) => ({
          height: 0,
          position: "fixed",
          right: 0,
          top: [t.height.nav.mobile, null, t.height.nav.desktop],
          zIndex: 99999,
        }))}
      />
    </ProductPageDataProvider>
  );
};

export default LongFormTheOne;

export const getStaticProps = makeProductPageStaticPropsGetter(
  "the-one",
  async (result, { params }, { apolloClient }) => {
    // const REVIEWS_PAGE = (await import("../../cms/reviews-page")).REVIEWS_PAGE;
    if (params && Array.isArray(params.customization)) {
      // Ingore invalid routes
      if (params.customization.length !== 1) {
        return {
          notFound: true,
        };
      }

      const customization = params.customization[0];

      const { data } = await runServerSideQuery(apolloClient, {
        query: CUSTOMIZATION,
        // REVIEWS_PAGE
        variables: {
          handle: `the-one-long-form-${customization}`,
        },
      });

      if (!data?.pCustomization) {
        return { notFound: true };
      }

      if (!data?.reviewsPage) {
        throw new Error("Unexpected missing review_page singleton type");
      }

      return {
        ...result,
        props: {
          ...result.props,
          customizationDict: toCustomizationDictionary(
            data.pCustomization.body
          ),
        },
      };
    }

    return result;
  }
);
