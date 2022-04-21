import { MockedResponse } from "@apollo/react-testing";
import { PRODUCT_BY_HANDLE } from "@sss/ecommerce/product";
import * as ecommerce from "@sss/ecommerce/testing";
import cloneDeep from "lodash.clonedeep";

import { PRODUCT_PAGE } from "../../product-page";

const pProductFragment = {
  __typename: "PProduct",
  _meta: {
    __typename: "PMeta",
    id: "XlOmChEAACUAkyRa",
    lang: "en-us",
    tags: [],
    type: "product",
    uid: "the-one",
  },
  announcement: null,
  announcementEnabled: false,
  benefits: [
    {
      __typename: "PProductBenefits",
      benefit: {
        __typename: "PBenefit",
        _meta: {
          __typename: "PMeta",
          id: "XsLAXxAAAFuz22Hq",
          lang: "en-us",
          tags: [],
          type: "benefit",
          uid: "joints",
        },
        icon: "joints",
        name: [
          {
            spans: [],
            text: "Joints & Mobility",
            type: "paragraph",
          },
        ],
        value: [
          {
            spans: [],
            text: "Relieves stiffness and protects cartilage",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductBenefits",
      benefit: {
        __typename: "PBenefit",
        _meta: {
          __typename: "PMeta",
          id: "XsLAlBAAACSz22LC",
          lang: "en-us",
          tags: [],
          type: "benefit",
          uid: "calming",
        },
        icon: "calming",
        name: [
          {
            spans: [],
            text: "Stress Relief",
            type: "paragraph",
          },
        ],
        value: [
          {
            spans: [],
            text: "Relaxes without any snoozy side effects",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductBenefits",
      benefit: {
        __typename: "PBenefit",
        _meta: {
          __typename: "PMeta",
          id: "XsLAlxAAAJKz22LT",
          lang: "en-us",
          tags: [],
          type: "benefit",
          uid: "digestion",
        },
        icon: "digestion",
        name: [
          {
            spans: [],
            text: "Gut",
            type: "paragraph",
          },
        ],
        value: [
          {
            spans: [],
            text: "Supports healthy gut bacteria and digestion",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductBenefits",
      benefit: {
        __typename: "PBenefit",
        _meta: {
          __typename: "PMeta",
          id: "XsLA1BAAAEO022P-",
          lang: "en-us",
          tags: [],
          type: "benefit",
          uid: "skin-and-coat",
        },
        icon: "skinCoat",
        name: [
          {
            spans: [],
            text: "Skin & Coat",
            type: "paragraph",
          },
        ],
        value: [
          {
            spans: [],
            text: "Soothes skin and conditions coat",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductBenefits",
      benefit: {
        __typename: "PBenefit",
        _meta: {
          __typename: "PMeta",
          id: "XsLA7RAAAJKz22R0",
          lang: "en-us",
          tags: [],
          type: "benefit",
          uid: "dental",
        },
        icon: "dental",
        name: [
          {
            spans: [],
            text: "Dental",
            type: "paragraph",
          },
        ],
        value: [
          {
            spans: [],
            text: "Reduces plaque for fresh breath and healthy gums",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductBenefits",
      benefit: {
        __typename: "PBenefit",
        _meta: {
          __typename: "PMeta",
          id: "XsLBBBAAAJKz22Tk",
          lang: "en-us",
          tags: [],
          type: "benefit",
          uid: "brain",
        },
        icon: "brain",
        name: [
          {
            spans: [],
            text: "Brain",
            type: "paragraph",
          },
        ],
        value: [
          {
            spans: [],
            text: "Promotes blood flow and mental sharpness",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductBenefits",
      benefit: {
        __typename: "PBenefit",
        _meta: {
          __typename: "PMeta",
          id: "XsLBIxAAAEm022Vy",
          lang: "en-us",
          tags: [],
          type: "benefit",
          uid: "immunity",
        },
        icon: "protect",
        name: [
          {
            spans: [],
            text: "Immunity",
            type: "paragraph",
          },
        ],
        value: [
          {
            spans: [],
            text: "Supports cells that defend against disease",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductBenefits",
      benefit: {
        __typename: "PBenefit",
        _meta: {
          __typename: "PMeta",
          id: "XsLBQBAAAFi022X3",
          lang: "en-us",
          tags: [],
          type: "benefit",
          uid: "heart",
        },
        icon: "heart",
        name: [
          {
            spans: [],
            text: "Heart",
            type: "paragraph",
          },
        ],
        value: [
          {
            spans: [],
            text: "Protects heart cells and sustains healthy function",
            type: "paragraph",
          },
        ],
      },
    },
  ],
  description: [
    {
      spans: [],
      text:
        "The One is a revolutionary blend of the most clinically-proven ingredients to be used in a dog supplement, ever. With its 8 benefits in one, it offers an unparalleled way to provide your bestie with top-to-tail preventative support in one simple daily dose.",
      type: "paragraph",
    },
    {
      spans: [],
      text: "12 clinically-proven ingredients",
      type: "list-item",
    },
    {
      spans: [],
      text: "Suitable for all dogs aged 1 year +",
      type: "list-item",
    },
    {
      spans: [],
      text: "Up to 2 months supply with every tub (60 scoops)",
      type: "list-item",
    },
  ],
  ingredients: [
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvIeREAACIAUOMU",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "chondroitin",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Our chondroitin is the most extensively researched on the market with over 40 clinical studies behind it.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic chondroitin?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "It plays an integral role in repairing cartilage tissue while also blocking the enzymes that cause it to degrade in the first place.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text:
              "Chondroitin is a naturally occurring sugar found in cartilage.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "Chondroitin is what gives your dog’s cartilage the soft, spongy texture it needs to cushion and protect their joints.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/579fda9b-185d-4947-b8cd-b8cd772a0730_chondroitin.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "CS b-Bioactive®",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 40.4637,
          longitude: -3.749200000000001,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "Spain",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "Bioiberica",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Balances the inflammatory system",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "Chondroitin",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvJIhEAACUAUOYj",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "curcumin",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Our curcumin is the only one in the world proven to work in dogs and offers up to 29x greater absorption.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic curcumin?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "Curcumin is rich in micronutrients whose protective benefits have been used in traditional medicine for centuries, while also being rigorously backed up by modern science.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text: "Curcumin is an antioxidant-rich compound found in Turmeric.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "Curcumin operates as an antioxidant, defending against cellular damage and blocking the enzymes that cause inflammation in the body.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/56d8c6bf-e03c-4534-a443-e3b29bca81bb_curcumin.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "Meriva®",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 41.8719,
          longitude: 12.567399999999996,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "Italy",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "Indena",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Strengthens joints and flexibility ",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "Curcumin",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvI2REAALNaUOTU",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "l-theanine",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Our L-Theanine is the only one proven to work in dogs and comes protected by more than 40 patents.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic L-Theanine?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "Like Ashwagandha, l-theanine is an adaptogen that works to reduce stress and anxiety without any drowsy side effects.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text: "L-theanine is an amino acid commonly found in green tea.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "L-theanine helps trigger the release of happy hormones, like serotonin and dopamine, while also stimulating calming alpha waves in the brain.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/3e043768-f08d-4296-9aef-b0439ed09059_l-theanine.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "Suntheanine®",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 36.204799999999985,
          longitude: 138.25289999999998,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "Japan",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "Taiyo",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Promotes an alert state of relaxation",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "L-Theanine",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvJTBEAACIAUObk",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "krill",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Our Krill is purpose-made for pets and is chemically structured to deliver more Omega 3 than other types of fish oil.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic Omega-3?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "Krill has one of the highest concentrations of Omega-3 in the world, surpassing fish oil in both strength and bioavailability. It also contains Astaxanthin, a powerful antioxidant.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text:
              "Krill a natural extract of the Antarctic krill, a tiny pink crustacean found in the Southern Ocean.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "Krill is incredibly rich in omega-3, enabling it to support a wide range of health benefits including improved heart function, reduced inflammation and a healthier skin and coat.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/3df747a0-0566-4e08-970e-933570c7259a_krill.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "QRILL™ Pet",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 60.472,
          longitude: 8.468900000000007,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "Norway",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "Aker",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Optimizes disease-fighting immune cells",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "Krill",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvI_hEAALNaUOV-",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "l-carnitine",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Formulated exclusively for animals, our L-Carnitine is the only one in the world that’s been proven safe and effective in dogs.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic L-Carnitine?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "L-carnitine is formulated exclusively for animals and is the only carnitine in the world that has been clinically proven safe and effective for canine consumption.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text:
              "L-carnitine is a naturally occurring amino acid derivative of carnitine.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "L-carnitine helps cells utilize fatty acids for energy, especially in the muscles. Studies also suggest it can aid exercise recovery and encourage muscle growth.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/6b1426ad-b17e-40bc-a494-6449454d27fe_l-carnitine.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "Carniking®",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 46.8182,
          longitude: 8.227499999999983,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "Switzerland",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "Lonza",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Maintains healthy muscle function",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "L-Carnitine",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvIHxEAALNaUOFn",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "ashwagandha",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Our Ashwagandha is the most powerful on the market and comes backed up by 12 clinical studies.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic Ashwagandha?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "Ashwagandha has been used safely and effectively for centuries in traditional and Ayurvedic medicine. Its benefits have also been supported by ample scientific evidence.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text:
              "Ashwagandha is an Ayurvedic herb found in India and North Africa.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "Ashwagandha is considered an adaptogen, a natural substance that supports the body's ability to deal with stress. By regulating the amount of cortisol circulating in the body, it helps to reduce anxiety, regulate blood sugar and improve immunity.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/878a2c8d-3b2c-499b-9a5b-3679a97583c7_ashwagandha.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "Sensoril®",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 20.5937,
          longitude: 78.9629,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "India",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "Natreon",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Alleviates symptoms of stress",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "Ashwagandha",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvH8REAACIAUOCV",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "msm",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Unparalleled in purity, our MSM is both the cleanest and the only one to be approved by the FDA.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic MSM?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "Along with providing multiple health benefits, MSM has been widely studied in humans with substantial numbers of research publications behind it.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text:
              "MSM is a natural sulfur often found in vegetables and fruit.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "MSM helps to stabilize the body’s network of connective tissue which plays a vital role in reducing pain and inflammation, preventing allergic reactions, maintaining healthy immune cells and supporting hair growth.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/8e6d0434-2592-4447-b57a-c1e621d39ba6_msm.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "OptiMSM®",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 37.09020000000001,
          longitude: -95.71290000000002,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "USA",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "Bergstrom",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Soothes skin and supports joints",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "MSM",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvJmhEAAAPkUOhT",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "postbiotic",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Our postbiotic is heat-inactivated and has been proven to outperform live strains.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic postbiotic?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "BPL1 has been identified as a ‘friendly’ gut bacteria strain, delivering positive results in both weight management and skin health trials.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text:
              "BPL1 is a heat treated postbiotic of Bifidobacterium animalis subsp. lactis",
            type: "paragraph",
          },
        ],
        effects: null,
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 2000,
            width: 2000,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/6cee69f6-99e6-454e-b64b-3651f3afbb0a_012-FOTP-Postbiotic.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "ADM Biopolis BPL1™",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 40.4637,
          longitude: -3.749200000000001,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "Spain",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "ADM",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Improves digestive health",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "Postbiotic",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvJfxEAALNaUOfO",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "green-tea-extract",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Our decaffeinated extract is the most researched on the market and is sourced direct from Japan’s pioneering supplier of green tea.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic green tea extract?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "The antibacterial benefits of green tea have been repeatedly shown to promote oral health naturally and safely.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text: "Green tea is a plant predominantly grown in Japan.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "Green tea is high in catechins, disease-fighting antioxidants that help to kill off bacteria in the body.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/cf887e06-32b4-44b3-97de-c89b2c2a4cbb_green-tea-extract.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "Sunphenon 90d®",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 36.204799999999985,
          longitude: 138.25289999999998,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "Japan",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "Taiyo",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Supports oral health",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "Green Tea Extract",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "Xd1EOREAACMAX4pN",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "glucosamine",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Sourced sustainably from vegetables, our glucosamine produces 98% less waste than those sourced from shellfish.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not generic glucosamine?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "It has been widely studied in both humans and animals and is backed by over 15,000 research publications. Specifically, oral supplementation of glucosamine has been shown to aid the repair of joint cartilage in dogs.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text:
              "Glucosamine is a naturally occurring amino sugar found in connective tissue and cartilage.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "Glucosamine is an essential building block in the structure of joint tendons, cartilage and ligaments.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/53caf43c-6466-4e06-9b94-da9b48ae5fbd_glucosamine.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "GreenGrown®",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 37.09020000000001,
          longitude: -95.71290000000002,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "USA",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "ENI",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Protects joints and improves flexibility",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "Glucosamine",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvIuBEAALNaUOQ8",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "prebiotic",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Our clinically-backed prebiotic is one of the few fibers in the world that doesn’t result in excess gas or bloating.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic Prebiotic?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "Sunfiber is water soluble and low GI, meaning it doesn’t disrupt vitamin and mineral absorption the same way that most fibers do. It also doesn’t cause any of the gas, bloating or digestive discomfort commonly associated with high-fibers sources.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text:
              "Sunfiber is an all-natural fiber derived from the Indian guar gum bean.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "As sunfiber passes through the intestines, it ferments into short-chain fatty acids that help to cultivate good bacteria in the gut and support intestinal health.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/8560791f-b345-46f5-99d0-c0e316cefe35_prebiotic.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "Sunfiber®",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 20.59370095641884,
          longitude: 78.96289765834808,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "India",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufactuer",
            value: "Taiyo",
          },
        ],
        summary: [
          {
            spans: [],
            text: "For a healthy microbiome",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "Prebiotic",
            type: "paragraph",
          },
        ],
      },
    },
    {
      __typename: "PProductIngredients",
      ingredient: {
        __typename: "PIngredient",
        _meta: {
          __typename: "PMeta",
          id: "XkvIbREAACUAUOLR",
          lang: "en-us",
          tags: [],
          type: "ingredient",
          uid: "taurine",
        },
        advantageDescription: [
          {
            spans: [],
            text:
              "Produced through a patented fermentation process, our Taurine is the purest, non-animal derived amino acid on the planet.",
            type: "paragraph",
          },
        ],
        advantageTitle: [
          {
            spans: [],
            text: "Why not a generic Taurine?",
            type: "paragraph",
          },
        ],
        benefits: [
          {
            spans: [],
            text:
              "There is a growing body of research suggesting that taurine deficiency may increase the risk of cardiac disease in dogs.",
            type: "paragraph",
          },
        ],
        description: [
          {
            spans: [],
            text:
              "Taurine is an amino acid commonly found in eggs, shellfish and meat.",
            type: "paragraph",
          },
        ],
        effects: [
          {
            spans: [],
            text:
              "Taurine has an antioxidant effect in protecting against cellular damage and has both neuro and cardiac protective properties.",
            type: "paragraph",
          },
        ],
        image: {
          alt: null,
          copyright: null,
          dimensions: {
            height: 1600,
            width: 1600,
          },
          url:
            "https://images.prismic.io/prod-fotp-frontend/67fbb4a7-e490-4144-ab42-f1537372e8c7_taurine.png?auto=compress,format",
        },
        productName: [
          {
            spans: [],
            text: "AjiPure®",
            type: "paragraph",
          },
        ],
        sourceLatLng: {
          latitude: 20.593700000000002,
          longitude: 78.96289999999999,
        },
        specifications: [
          {
            __typename: "PIngredientSpecifications",
            name: "Source",
            value: "India",
          },
          {
            __typename: "PIngredientSpecifications",
            name: "Manufacturer",
            value: "Ajinomoto",
          },
        ],
        summary: [
          {
            spans: [],
            text: "Promotes a healthy heart",
            type: "paragraph",
          },
        ],
        type: [
          {
            spans: [],
            text: "Taurine",
            type: "paragraph",
          },
        ],
      },
    },
  ],
  ingredientsCallToAction: null,
  ingredientsDescription: [
    {
      spans: [],
      text:
        "Most dog supplements lack evidence and rely on borrowed scientific claims. The One is different. All twelve ingredients are patented and clinically-proven to do precisely what they say.",
      type: "paragraph",
    },
  ],
  ingredientsTitle: [
    {
      spans: [
        {
          end: 23,
          start: 12,
          type: "em",
        },
      ],
      text: "Ingredients guaranteed to make your bestie thrive",
      type: "paragraph",
    },
  ],
  otherIngredients: [
    {
      spans: [],
      text: "Beetroot, natural chicken flavor (vegan)",
      type: "paragraph",
    },
  ],
  servingSizes: [
    {
      __typename: "PProductServingSizes",
      name: "Less than 25Ibs",
      value: "1 scoop",
    },
    {
      __typename: "PProductServingSizes",
      name: "25Ibs – 50Ibs",
      value: "2 scoops",
    },
    {
      __typename: "PProductServingSizes",
      name: "50Ibs or more",
      value: "3 scoops",
    },
  ],
  socialMediaDescription: null,
  socialMediaImage: null,
  socialMediaTitle: null,
  suitability: [
    {
      spans: [],
      text:
        "The suitability of this product has not been tested for dogs under the age of 12 months, pregnant or lactating dogs",
      type: "paragraph",
    },
  ],
  typicalValues: [
    {
      __typename: "PProductTypicalValues",
      name: "Partially hydrolyzed guar gum (SunFiber®)",
      value: "525mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "Whole Antarctic krill meal (Qrill®; Euphasia superba)",
      value: "500mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "Glucosamine HCI (GreenGrown® [shellfish-free])",
      value: "250mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "Chondroitin Sulphate (CS b-Bioactive® [bovine])",
      value: "100mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "Methylsulfonylmethane (OptiMSM®)",
      value: "100mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "Taurine (Ajipure®)",
      value: "100mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "Curcumin Phytosome® complex (Meriva®; Curcuma longa [root])",
      value: "60mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "L-carnitine (Carniking®)",
      value: "50mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "Bifidobacterium lactis BPL1 CECT 8145 (heat-treated)",
      value: "50mg",
    },
    {
      __typename: "PProductTypicalValues",
      name:
        "Green tea extract (Sunphenon® 90D; Camellia sinesis [leaf], decaffeinated)",
      value: "40mg",
    },
    {
      __typename: "PProductTypicalValues",
      name:
        "Certified organic ashwagandha extract (Sensoril®; Withania somnifera [root, leaf])",
      value: "30mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "L-theanine (Suntheanine® enzymatically produced/solvent-free)",
      value: "25mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "Kelp",
      value: "60mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "Sea Buckthorn",
      value: "60mg",
    },
    {
      __typename: "PProductTypicalValues",
      name: "Natural flavoring",
      value: "50mg",
    },
  ],
  typicalValuesLabel: [
    {
      spans: [
        {
          end: 24,
          start: 0,
          type: "strong",
        },
      ],
      text: "Typical values per scoop",
      type: "paragraph",
    },
  ],
  use: [
    {
      spans: [],
      text:
        "Sprinkle the recommended number of scoops onto your dog’s food once a day, or mix it in with one of their favorite healthy snacks.",
      type: "paragraph",
    },
    {
      spans: [],
      text:
        "When used on a consistent daily basis, positive improvements should begin to appear within 4 - 6 weeks.",
      type: "paragraph",
    },
  ],
};

export const failure: MockedResponse[] = [
  {
    request: {
      query: PRODUCT_PAGE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        foo: true,
        productPage: null,
      },
    },
  },
  {
    request: {
      query: PRODUCT_BY_HANDLE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        productByHandle: null,
      },
      errors: [
        {
          locations: [
            {
              column: 3,
              line: 2,
            },
          ],
          message:
            "request to https://test-front-of-the-pack-us.myshopify.com/api/2021-01/graphql.json failed, reason: getaddrinfo ENOTFOUND test-front-of-the-pack-us.myshopify.com",
          path: ["productByHandle"],
        } as any,
      ],
    },
  },
];

export const none: MockedResponse[] = [
  {
    request: {
      query: PRODUCT_PAGE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        foo: true,
        productPage: null,
      },
    },
  },
  {
    request: {
      query: PRODUCT_BY_HANDLE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        product: null,
      },
    },
  },
];

export const oneTime: MockedResponse[] = [
  {
    request: {
      query: PRODUCT_PAGE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        productPage: {
          __typename: "PProductPage",
          _meta: {
            __typename: "PMeta",
            id: "Xr7m1xAAAAVkyvsH",
            lang: "en-us",
            tags: [],
            type: "product_page",
            uid: "the-one",
          },
          body: [
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "natural_features",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyFeatures",
              fields: [
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "Prevention is the best cure. And your dog deserves the best.",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "Our experts identified the eight areas your bestie is bound to struggle with most. Then they developed a supplement to tackle each and every one of them. Head on. ",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "They’ve got your back. \nNow you can get theirs.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2160,
                      width: 2944,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/edbb2815-9b2c-4fc1-8e1f-5135d47af84d_hammock-bois.jpg?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
              ],
              label: "standard",
              type: "features",
            },
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "benefits",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "ingredients_and_details",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyTestimonials",
              fields: [
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxPtxEAACQADAR7",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Pepper’s mom",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 1264,
                        width: 1304,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/8d84529e-aff4-44b6-acd0-449eb6efb98b_pepper.png?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "My last dog had so many health conditions. I’m not letting that happen this time around.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxQFREAACQADAVA",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Baxter's dad",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 680,
                        width: 680,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/7dab850c-2c53-443f-8bee-18e226fcbd46_baxter.jpg?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "Baxter’s itchy skin has totally cleared up. I haven’t caught him scratching in weeks.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxQMxEAACQADAV4",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Nugget's mom",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 600,
                        width: 600,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/63e97f51-763c-41f1-b5f2-45fdbb0dd2bd_nugget.jpg?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "Pugs are predisposed to lots of diseases. It’s great to know that Nugget can get ahead of them now.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
              ],
              primary: {
                __typename: "PProductPageBodyTestimonialsPrimary",
                heading: [
                  {
                    spans: [],
                    text: "Loved by dogs and their humans",
                    type: "paragraph",
                  },
                ],
              },
              type: "testimonials",
            },
            {
              __typename: "PProductPageBodyExpertQuote",
              primary: {
                __typename: "PProductPageBodyExpertQuotePrimary",
                expert: {
                  __typename: "PExpert",
                  _meta: {
                    __typename: "PMeta",
                    id: "XlPmGhEAACUAlEEm",
                    lang: "en-us",
                    tags: [],
                    type: "expert",
                    uid: null,
                  },
                  bio: [
                    {
                      spans: [],
                      text:
                        "Anthony is a nutritional and exercise biochemist with an impressive record of industry and academic accomplishments. During his 45 year career, he has earned 3 patents, collaborated on over 50 clinical trials and pioneered entirely new nutritional supplement categories – creatine and thermogenics among them. Along with chairing Front Of The Pack's Science Advisory Board, Anthony is also the founder and CEO of IMAGINutrition, a nutritional technology think tank focused on clinical research, due diligence, and product innovation.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 1140,
                      width: 1140,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/a37c30af-9a48-4274-ae41-7c4ade99d831_anthony.jpg?auto=compress,format",
                  },
                  name: [
                    {
                      spans: [],
                      text: "Anthony L. Almada",
                      type: "paragraph",
                    },
                  ],
                  postNominal: [
                    {
                      spans: [],
                      text: "MSc, FISSN",
                      type: "paragraph",
                    },
                  ],
                  role: [
                    {
                      spans: [],
                      text: "Biochemist",
                      type: "paragraph",
                    },
                  ],
                },
                heading: [
                  {
                    spans: [
                      {
                        end: 27,
                        start: 14,
                        type: "em",
                      },
                    ],
                    text: "Backed by our world-leading board of experts",
                    type: "paragraph",
                  },
                ],
                quote: [
                  {
                    spans: [],
                    text:
                      "Supplements are an excellent way to provide your dog with additional benefits that go beyond a healthy diet.",
                    type: "paragraph",
                  },
                ],
              },
              type: "expert_quote",
            },
            {
              __typename: "PProductPageBodyFeatures",
              fields: [
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "We’ve developed a savory broth-like flavor that’s proven to appeal to 98% of dogs - even the fussiest. All natural, nothing artificial.",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "Simply sprinkle the recommended number of scoops on your bestie’s food and watch them woof it down.",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Tasty for them.\nSimple for you.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2160,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/1cec46b3-0ae0-45a0-a830-f7d51c263325_tasty.jpg?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "We like to go light on packaging. What little we do use is 100% eco-friendly, from the recyclable tub that holds your dog’s supplement, to the compostable pouch that lines it. ",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Supporting your dog.\nAnd the environment.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2400,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/84af1e9f-9d02-46d6-86ba-a6f4fe8559fc_fotp-environment.png?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: [
                    {
                      spans: [],
                      text: "Subscribe now",
                      type: "paragraph",
                    },
                  ],
                  callToActionTarget: "#product-title",
                  description: [
                    {
                      spans: [],
                      text:
                        "Hook your doggo up with a subscription and save on every delivery.    ",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "And remember - no tight-leash commitments here! You can cancel or change your delivery schedule any time. Free shipping always.",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Subscribe & Save",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2400,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/48b3de93-b86f-4bef-b44e-ead07656f039_product-subscribe-image.png?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
              ],
              label: "hero",
              type: "features",
            },
            {
              __typename: "PProductPageBodySnippet",
              primary: {
                __typename: "PProductPageBodySnippetPrimary",
                snippet: {
                  __typename: "PSnippet",
                  _meta: {
                    __typename: "PMeta",
                    id: "Xr6ynBAAACgzyg1y",
                    lang: "en-us",
                    tags: [],
                    type: "snippet",
                    uid: "powder-faqs",
                  },
                  body: [
                    {
                      __typename: "PSnippetBodyFaqCategory",
                      fields: [
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnJxEAACIAlEYU",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "results",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "When taken on a regular daily basis, most dogs will begin to show results within around 6 weeks.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "How long will it take to see the results of my dog’s supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XkPL_REAACMALXFA",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "overdose",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements are carefully balanced with your dog’s weight in mind and we always recommend that you stick to the suggested once-daily dose. In the event that your dog accidentally consumes more than the daily recommended dose, consult your vet for advice.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "Is there any risk of my dog overdosing on their supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnjhEAACQAlEf8",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "taste",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements are blended with a nutritious broth-like flavoring proven to be very palatable to dogs. Made from all-natural ingredients and botanicals, this flavoring is allergen-free, contains no artificial nasties and is 100% safe for canine consumption.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Will my dog like the taste?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "Xo3R-xAAACQAJnCd",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "allergen-free",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Yes, along with being gluten-free, pesticide-free and non-GMO, all of our supplements are either allergen-free or hypoallergenic.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Are the supplements allergen-free?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnTREAACMAlEbF",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "safe-for-humans",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements have been specifically formulated for canine consumption and we do not recommend that humans take it.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Can I eat my dog’s supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "Xo33aRAAAB8AJxzs",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "free-shipping",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "You betcha! Front Of The Pack includes shipping on all products free of charge.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Is shipping free?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XkLlCREAACIAKWX_",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "cancel",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Of course! You are free to cancel your dog’s subscription at any time. This will take place effective immediately and you will not be billed following the date of your cancellation.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "Can I cancel my subscription at any time?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                      ],
                      primary: {
                        __typename: "PSnippetBodyFaqCategoryPrimary",
                        heading: null,
                      },
                      type: "faq_category",
                    },
                  ],
                },
              },
              type: "snippet",
            },
          ],
          product: pProductFragment,
        },
      },
    },
  },
  {
    request: {
      query: PRODUCT_BY_HANDLE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        product: {
          ...ecommerce.mockedResponses.product.productCoreMove,
          __typename: "Product",
          availableForSale: true,
          bottomline: {
            __typename: "ReviewBottomline",
            averageScore: 4.5,
            totalReviews: 2,
          },
          bundleUnit: null,
          bundleUnitPlural: null,
          compareAtPriceV2: null,
          defaultSelectionSku: null,
          defaultSelectionSubscription: null,
          defaultVariantOrder: null,
          description: "Targeted joint and mobility support",
          hasSubscription: null,
          images: {
            __typename: "ImageConnection",
            edges: [
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "1",
                  url: "https://cdn.shopify.com/mock-image/product-1.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "2",
                  url: "https://cdn.shopify.com/mock-image/product-2.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "3",
                  url: "https://cdn.shopify.com/mock-image/product-3.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "4",
                  url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
                  width: 1000,
                },
              },
            ],
          },
          isSubscriptionOnly: null,
          listingSku: null,
          listingSubscription: null,
          listingSubtitle: null,
          options: [
            {
              __typename: "ProductOption",
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0T3B0aW9uLzU4NzMxNjM4NjIwOTQ=",
              name: "Title",
              values: ["Default Title"],
            },
          ],
          preorderShippingEstimate: null,
          seo: { description: "", title: "" },
          subscriptionFrequencies: null,
          subscriptionUnit: null,
          unit: null,
          variants: {
            __typename: "ProductVariantConnection",
            edges: [
              {
                __typename: "ProductVariantEdge",
                node: {
                  __typename: "ProductVariant",
                  availableForSale: true,
                  barcode: "123",
                  bundleSize: null,
                  compareAtPriceV2: null,
                  defaultShippingIntervalFrequency: {
                    __typename: "Metafield",
                    id: "defaultShippingIntervalFrequency-1",
                    value: "1",
                  },
                  id:
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTc0NjY1MDQwNjk5MA==",
                  image: {
                    __typename: "Image",
                    height: 1000,
                    id: "4",
                    url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
                    width: 1000,
                  },
                  listingUsp: null,
                  priceV2: {
                    __typename: "MoneyV2",
                    amount: "34.99",
                    currencyCode: "USD",
                  },
                  quantityAvailable: 10,
                  selectedOptions: [
                    {
                      __typename: "SelectedOption",
                      name: "Title",
                      value: "Default Title",
                    },
                  ],
                  sku: "move",
                  subscriptionPriceAmount: null,
                  title: "Default Title",
                },
              },
            ],
          },
        },
      },
    },
  },
];

export const oneTimeSale: MockedResponse[] = [
  {
    request: {
      query: PRODUCT_PAGE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        productPage: {
          __typename: "PProductPage",
          _meta: {
            __typename: "PMeta",
            id: "Xr7m1xAAAAVkyvsH",
            lang: "en-us",
            tags: [],
            type: "product_page",
            uid: "the-one",
          },
          body: [
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "natural_features",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyFeatures",
              fields: [
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "Prevention is the best cure. And your dog deserves the best.",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "Our experts identified the eight areas your bestie is bound to struggle with most. Then they developed a supplement to tackle each and every one of them. Head on. ",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "They’ve got your back. \nNow you can get theirs.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2160,
                      width: 2944,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/edbb2815-9b2c-4fc1-8e1f-5135d47af84d_hammock-bois.jpg?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
              ],
              label: "standard",
              type: "features",
            },
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "benefits",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "ingredients_and_details",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyTestimonials",
              fields: [
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxPtxEAACQADAR7",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Pepper’s mom",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 1264,
                        width: 1304,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/8d84529e-aff4-44b6-acd0-449eb6efb98b_pepper.png?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "My last dog had so many health conditions. I’m not letting that happen this time around.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxQFREAACQADAVA",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Baxter's dad",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 680,
                        width: 680,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/7dab850c-2c53-443f-8bee-18e226fcbd46_baxter.jpg?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "Baxter’s itchy skin has totally cleared up. I haven’t caught him scratching in weeks.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxQMxEAACQADAV4",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Nugget's mom",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 600,
                        width: 600,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/63e97f51-763c-41f1-b5f2-45fdbb0dd2bd_nugget.jpg?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "Pugs are predisposed to lots of diseases. It’s great to know that Nugget can get ahead of them now.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
              ],
              primary: {
                __typename: "PProductPageBodyTestimonialsPrimary",
                heading: [
                  {
                    spans: [],
                    text: "Loved by dogs and their humans",
                    type: "paragraph",
                  },
                ],
              },
              type: "testimonials",
            },
            {
              __typename: "PProductPageBodyExpertQuote",
              primary: {
                __typename: "PProductPageBodyExpertQuotePrimary",
                expert: {
                  __typename: "PExpert",
                  _meta: {
                    __typename: "PMeta",
                    id: "XlPmGhEAACUAlEEm",
                    lang: "en-us",
                    tags: [],
                    type: "expert",
                    uid: null,
                  },
                  bio: [
                    {
                      spans: [],
                      text:
                        "Anthony is a nutritional and exercise biochemist with an impressive record of industry and academic accomplishments. During his 45 year career, he has earned 3 patents, collaborated on over 50 clinical trials and pioneered entirely new nutritional supplement categories – creatine and thermogenics among them. Along with chairing Front Of The Pack's Science Advisory Board, Anthony is also the founder and CEO of IMAGINutrition, a nutritional technology think tank focused on clinical research, due diligence, and product innovation.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 1140,
                      width: 1140,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/a37c30af-9a48-4274-ae41-7c4ade99d831_anthony.jpg?auto=compress,format",
                  },
                  name: [
                    {
                      spans: [],
                      text: "Anthony L. Almada",
                      type: "paragraph",
                    },
                  ],
                  postNominal: [
                    {
                      spans: [],
                      text: "MSc, FISSN",
                      type: "paragraph",
                    },
                  ],
                  role: [
                    {
                      spans: [],
                      text: "Biochemist",
                      type: "paragraph",
                    },
                  ],
                },
                heading: [
                  {
                    spans: [
                      {
                        end: 27,
                        start: 14,
                        type: "em",
                      },
                    ],
                    text: "Backed by our world-leading board of experts",
                    type: "paragraph",
                  },
                ],
                quote: [
                  {
                    spans: [],
                    text:
                      "Supplements are an excellent way to provide your dog with additional benefits that go beyond a healthy diet.",
                    type: "paragraph",
                  },
                ],
              },
              type: "expert_quote",
            },
            {
              __typename: "PProductPageBodyFeatures",
              fields: [
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "We’ve developed a savory broth-like flavor that’s proven to appeal to 98% of dogs - even the fussiest. All natural, nothing artificial.",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "Simply sprinkle the recommended number of scoops on your bestie’s food and watch them woof it down.",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Tasty for them.\nSimple for you.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2160,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/1cec46b3-0ae0-45a0-a830-f7d51c263325_tasty.jpg?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "We like to go light on packaging. What little we do use is 100% eco-friendly, from the recyclable tub that holds your dog’s supplement, to the compostable pouch that lines it. ",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Supporting your dog.\nAnd the environment.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2400,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/84af1e9f-9d02-46d6-86ba-a6f4fe8559fc_fotp-environment.png?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: [
                    {
                      spans: [],
                      text: "Subscribe now",
                      type: "paragraph",
                    },
                  ],
                  callToActionTarget: "#product-title",
                  description: [
                    {
                      spans: [],
                      text:
                        "Hook your doggo up with a subscription and save on every delivery.    ",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "And remember - no tight-leash commitments here! You can cancel or change your delivery schedule any time. Free shipping always.",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Subscribe & Save",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2400,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/48b3de93-b86f-4bef-b44e-ead07656f039_product-subscribe-image.png?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
              ],
              label: "hero",
              type: "features",
            },
            {
              __typename: "PProductPageBodySnippet",
              primary: {
                __typename: "PProductPageBodySnippetPrimary",
                snippet: {
                  __typename: "PSnippet",
                  _meta: {
                    __typename: "PMeta",
                    id: "Xr6ynBAAACgzyg1y",
                    lang: "en-us",
                    tags: [],
                    type: "snippet",
                    uid: "powder-faqs",
                  },
                  body: [
                    {
                      __typename: "PSnippetBodyFaqCategory",
                      fields: [
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnJxEAACIAlEYU",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "results",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "When taken on a regular daily basis, most dogs will begin to show results within around 6 weeks.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "How long will it take to see the results of my dog’s supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XkPL_REAACMALXFA",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "overdose",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements are carefully balanced with your dog’s weight in mind and we always recommend that you stick to the suggested once-daily dose. In the event that your dog accidentally consumes more than the daily recommended dose, consult your vet for advice.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "Is there any risk of my dog overdosing on their supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnjhEAACQAlEf8",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "taste",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements are blended with a nutritious broth-like flavoring proven to be very palatable to dogs. Made from all-natural ingredients and botanicals, this flavoring is allergen-free, contains no artificial nasties and is 100% safe for canine consumption.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Will my dog like the taste?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "Xo3R-xAAACQAJnCd",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "allergen-free",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Yes, along with being gluten-free, pesticide-free and non-GMO, all of our supplements are either allergen-free or hypoallergenic.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Are the supplements allergen-free?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnTREAACMAlEbF",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "safe-for-humans",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements have been specifically formulated for canine consumption and we do not recommend that humans take it.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Can I eat my dog’s supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "Xo33aRAAAB8AJxzs",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "free-shipping",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "You betcha! Front Of The Pack includes shipping on all products free of charge.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Is shipping free?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XkLlCREAACIAKWX_",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "cancel",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Of course! You are free to cancel your dog’s subscription at any time. This will take place effective immediately and you will not be billed following the date of your cancellation.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "Can I cancel my subscription at any time?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                      ],
                      primary: {
                        __typename: "PSnippetBodyFaqCategoryPrimary",
                        heading: null,
                      },
                      type: "faq_category",
                    },
                  ],
                },
              },
              type: "snippet",
            },
          ],
          product: pProductFragment,
        },
      },
    },
  },
  {
    request: {
      query: PRODUCT_BY_HANDLE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        product: {
          ...ecommerce.mockedResponses.product.productCoreMove,
          __typename: "Product",
          availableForSale: true,
          bottomline: {
            __typename: "ReviewBottomline",
            averageScore: 4.5,
            totalReviews: 2,
          },
          bundleUnit: null,
          bundleUnitPlural: null,
          defaultSelectionSku: null,
          defaultSelectionSubscription: null,
          defaultVariantOrder: null,
          description: "Targeted joint and mobility support",
          hasSubscription: null,
          images: {
            __typename: "ImageConnection",
            edges: [
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "1",
                  url: "https://cdn.shopify.com/mock-image/product-1.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "2",
                  url: "https://cdn.shopify.com/mock-image/product-2.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "3",
                  url: "https://cdn.shopify.com/mock-image/product-3.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "4",
                  url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
                  width: 1000,
                },
              },
            ],
          },
          isSubscriptionOnly: null,
          listingSku: null,
          listingSubscription: null,
          listingSubtitle: null,
          options: [
            {
              __typename: "ProductOption",
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0T3B0aW9uLzU4NzMxNjM4NjIwOTQ=",
              name: "Title",
              values: ["Default Title"],
            },
          ],
          preorderShippingEstimate: null,
          seo: { description: "", title: "" },
          subscriptionFrequencies: null,
          subscriptionUnit: null,
          unit: null,
          variants: {
            __typename: "ProductVariantConnection",
            edges: [
              {
                __typename: "ProductVariantEdge",
                node: {
                  __typename: "ProductVariant",
                  availableForSale: true,
                  barcode: "123",
                  bundleSize: null,
                  compareAtPriceV2: {
                    __typename: "MoneyV2",
                    amount: "39.99",
                    currencyCode: "USD",
                  },
                  defaultShippingIntervalFrequency: {
                    __typename: "Metafield",
                    id: "defaultShippingIntervalFrequency-2",
                    value: "1",
                  },
                  id:
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTc0NjY1MDQwNjk5MA==",
                  image: {
                    __typename: "Image",
                    height: 1000,
                    id: "4",
                    url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
                    width: 1000,
                  },
                  listingUsp: null,
                  priceV2: {
                    __typename: "MoneyV2",
                    amount: "34.99",
                    currencyCode: "USD",
                  },
                  quantityAvailable: 10,
                  selectedOptions: [
                    {
                      __typename: "SelectedOption",
                      name: "Title",
                      value: "Default Title",
                    },
                  ],
                  sku: "move",
                  subscriptionPriceAmount: null,
                  title: "Default Title",
                },
              },
            ],
          },
        },
      },
    },
  },
];

const preorderSaleProduct = cloneDeep(oneTimeSale[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(preorderSaleProduct.result as any).data.product = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(preorderSaleProduct.result as any).data.product,
  preorderShippingEstimate: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTI5ODM3MTUyMzM4NzA=",
    value: "2020-10-28",
  },
  preorderType: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTI5ODIzNzg3NTgyMjI=",
    value: "shopify",
  },
};
export const preorderSale = [oneTimeSale[0], preorderSaleProduct];

const preorderProduct = cloneDeep(oneTime[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(preorderProduct.result as any).data.product = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(preorderProduct.result as any).data.product,
  preorderShippingEstimate: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTI5ODM3MTUyMzM4NzA=",
    value: "2020-10-28",
  },
  preorderType: {
    __typename: "Metafield",
    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTI5ODIzNzg3NTgyMjI=",
    value: "shopify",
  },
};
export const preorder = [oneTime[0], preorderProduct];

export const subscription: MockedResponse[] = [
  {
    request: {
      query: PRODUCT_PAGE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        productPage: {
          __typename: "PProductPage",
          _meta: {
            __typename: "PMeta",
            id: "Xr7m1xAAAAVkyvsH",
            lang: "en-us",
            tags: [],
            type: "product_page",
            uid: "the-one",
          },
          body: [
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "natural_features",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyFeatures",
              fields: [
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "Prevention is the best cure. And your dog deserves the best.",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "Our experts identified the eight areas your bestie is bound to struggle with most. Then they developed a supplement to tackle each and every one of them. Head on. ",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "They’ve got your back. \nNow you can get theirs.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2160,
                      width: 2944,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/edbb2815-9b2c-4fc1-8e1f-5135d47af84d_hammock-bois.jpg?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
              ],
              label: "standard",
              type: "features",
            },
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "benefits",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "ingredients_and_details",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyTestimonials",
              fields: [
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxPtxEAACQADAR7",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Pepper’s mom",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 1264,
                        width: 1304,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/8d84529e-aff4-44b6-acd0-449eb6efb98b_pepper.png?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "My last dog had so many health conditions. I’m not letting that happen this time around.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxQFREAACQADAVA",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Baxter's dad",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 680,
                        width: 680,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/7dab850c-2c53-443f-8bee-18e226fcbd46_baxter.jpg?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "Baxter’s itchy skin has totally cleared up. I haven’t caught him scratching in weeks.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxQMxEAACQADAV4",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Nugget's mom",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 600,
                        width: 600,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/63e97f51-763c-41f1-b5f2-45fdbb0dd2bd_nugget.jpg?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "Pugs are predisposed to lots of diseases. It’s great to know that Nugget can get ahead of them now.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
              ],
              primary: {
                __typename: "PProductPageBodyTestimonialsPrimary",
                heading: [
                  {
                    spans: [],
                    text: "Loved by dogs and their humans",
                    type: "paragraph",
                  },
                ],
              },
              type: "testimonials",
            },
            {
              __typename: "PProductPageBodyExpertQuote",
              primary: {
                __typename: "PProductPageBodyExpertQuotePrimary",
                expert: {
                  __typename: "PExpert",
                  _meta: {
                    __typename: "PMeta",
                    id: "XlPmGhEAACUAlEEm",
                    lang: "en-us",
                    tags: [],
                    type: "expert",
                    uid: null,
                  },
                  bio: [
                    {
                      spans: [],
                      text:
                        "Anthony is a nutritional and exercise biochemist with an impressive record of industry and academic accomplishments. During his 45 year career, he has earned 3 patents, collaborated on over 50 clinical trials and pioneered entirely new nutritional supplement categories – creatine and thermogenics among them. Along with chairing Front Of The Pack's Science Advisory Board, Anthony is also the founder and CEO of IMAGINutrition, a nutritional technology think tank focused on clinical research, due diligence, and product innovation.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 1140,
                      width: 1140,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/a37c30af-9a48-4274-ae41-7c4ade99d831_anthony.jpg?auto=compress,format",
                  },
                  name: [
                    {
                      spans: [],
                      text: "Anthony L. Almada",
                      type: "paragraph",
                    },
                  ],
                  postNominal: [
                    {
                      spans: [],
                      text: "MSc, FISSN",
                      type: "paragraph",
                    },
                  ],
                  role: [
                    {
                      spans: [],
                      text: "Biochemist",
                      type: "paragraph",
                    },
                  ],
                },
                heading: [
                  {
                    spans: [
                      {
                        end: 27,
                        start: 14,
                        type: "em",
                      },
                    ],
                    text: "Backed by our world-leading board of experts",
                    type: "paragraph",
                  },
                ],
                quote: [
                  {
                    spans: [],
                    text:
                      "Supplements are an excellent way to provide your dog with additional benefits that go beyond a healthy diet.",
                    type: "paragraph",
                  },
                ],
              },
              type: "expert_quote",
            },
            {
              __typename: "PProductPageBodyFeatures",
              fields: [
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "We’ve developed a savory broth-like flavor that’s proven to appeal to 98% of dogs - even the fussiest. All natural, nothing artificial.",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "Simply sprinkle the recommended number of scoops on your bestie’s food and watch them woof it down.",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Tasty for them.\nSimple for you.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2160,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/1cec46b3-0ae0-45a0-a830-f7d51c263325_tasty.jpg?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "We like to go light on packaging. What little we do use is 100% eco-friendly, from the recyclable tub that holds your dog’s supplement, to the compostable pouch that lines it. ",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Supporting your dog.\nAnd the environment.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2400,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/84af1e9f-9d02-46d6-86ba-a6f4fe8559fc_fotp-environment.png?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: [
                    {
                      spans: [],
                      text: "Subscribe now",
                      type: "paragraph",
                    },
                  ],
                  callToActionTarget: "#product-title",
                  description: [
                    {
                      spans: [],
                      text:
                        "Hook your doggo up with a subscription and save on every delivery.    ",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "And remember - no tight-leash commitments here! You can cancel or change your delivery schedule any time. Free shipping always.",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Subscribe & Save",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2400,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/48b3de93-b86f-4bef-b44e-ead07656f039_product-subscribe-image.png?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
              ],
              label: "hero",
              type: "features",
            },
            {
              __typename: "PProductPageBodySnippet",
              primary: {
                __typename: "PProductPageBodySnippetPrimary",
                snippet: {
                  __typename: "PSnippet",
                  _meta: {
                    __typename: "PMeta",
                    id: "Xr6ynBAAACgzyg1y",
                    lang: "en-us",
                    tags: [],
                    type: "snippet",
                    uid: "powder-faqs",
                  },
                  body: [
                    {
                      __typename: "PSnippetBodyFaqCategory",
                      fields: [
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnJxEAACIAlEYU",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "results",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "When taken on a regular daily basis, most dogs will begin to show results within around 6 weeks.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "How long will it take to see the results of my dog’s supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XkPL_REAACMALXFA",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "overdose",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements are carefully balanced with your dog’s weight in mind and we always recommend that you stick to the suggested once-daily dose. In the event that your dog accidentally consumes more than the daily recommended dose, consult your vet for advice.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "Is there any risk of my dog overdosing on their supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnjhEAACQAlEf8",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "taste",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements are blended with a nutritious broth-like flavoring proven to be very palatable to dogs. Made from all-natural ingredients and botanicals, this flavoring is allergen-free, contains no artificial nasties and is 100% safe for canine consumption.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Will my dog like the taste?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "Xo3R-xAAACQAJnCd",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "allergen-free",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Yes, along with being gluten-free, pesticide-free and non-GMO, all of our supplements are either allergen-free or hypoallergenic.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Are the supplements allergen-free?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnTREAACMAlEbF",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "safe-for-humans",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements have been specifically formulated for canine consumption and we do not recommend that humans take it.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Can I eat my dog’s supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "Xo33aRAAAB8AJxzs",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "free-shipping",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "You betcha! Front Of The Pack includes shipping on all products free of charge.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Is shipping free?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XkLlCREAACIAKWX_",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "cancel",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Of course! You are free to cancel your dog’s subscription at any time. This will take place effective immediately and you will not be billed following the date of your cancellation.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "Can I cancel my subscription at any time?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                      ],
                      primary: {
                        __typename: "PSnippetBodyFaqCategoryPrimary",
                        heading: null,
                      },
                      type: "faq_category",
                    },
                  ],
                },
              },
              type: "snippet",
            },
          ],
          product: pProductFragment,
        },
      },
    },
  },
  {
    request: {
      query: PRODUCT_BY_HANDLE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        product: {
          ...ecommerce.mockedResponses.product.productCoreMove,
          __typename: "Product",
          availableForSale: true,
          bottomline: {
            __typename: "ReviewBottomline",
            averageScore: 4.5,
            totalReviews: 2,
          },
          bundleUnit: null,
          bundleUnitPlural: null,
          defaultSelectionSku: null,
          defaultSelectionSubscription: null,
          defaultVariantOrder: null,
          description: "Targeted joint and mobility support",
          hasSubscription: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTE5NDA5Nzc4MzYxMTA=",
            value: "True",
          },
          images: {
            __typename: "ImageConnection",
            edges: [
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "1",
                  url: "https://cdn.shopify.com/mock-image/product-1.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "2",
                  url: "https://cdn.shopify.com/mock-image/product-2.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "3",
                  url: "https://cdn.shopify.com/mock-image/product-3.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "4",
                  url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
                  width: 1000,
                },
              },
            ],
          },
          isSubscriptionOnly: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTE5NDA5Nzc4MzYxXXX=",
            value: "False",
          },
          listingSku: null,
          listingSubscription: null,
          listingSubtitle: null,
          options: [
            {
              __typename: "ProductOption",
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0T3B0aW9uLzU4NzMxNjM4NjIwOTQ=",
              name: "Title",
              values: ["Default Title"],
            },
          ],
          preorderShippingEstimate: null,
          seo: { description: "", title: "" },
          subscriptionFrequencies: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTE5NDA5Nzc4Njg4Nzg=",
            value: "20,30,60",
          },
          subscriptionUnit: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTIzMDY2MDA1NTg2NzA=",
            value: "Days",
          },
          unit: null,
          variants: {
            __typename: "ProductVariantConnection",
            edges: [
              {
                __typename: "ProductVariantEdge",
                node: {
                  __typename: "ProductVariant",
                  availableForSale: true,
                  barcode: "123",
                  bundleSize: null,
                  compareAtPriceV2: null,
                  defaultShippingIntervalFrequency: {
                    __typename: "Metafield",
                    id: "defaultShippingIntervalFrequency-3",
                    value: "1",
                  },
                  id:
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTc0NjY1MDQwNjk5MA==",
                  image: {
                    __typename: "Image",
                    height: 1000,
                    id: "4",
                    url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
                    width: 1000,
                  },
                  listingUsp: null,
                  priceV2: {
                    __typename: "MoneyV2",
                    amount: "34.99",
                    currencyCode: "USD",
                  },
                  quantityAvailable: 10,
                  selectedOptions: [
                    {
                      __typename: "SelectedOption",
                      name: "Title",
                      value: "Default Title",
                    },
                  ],
                  sku: "move",
                  subscriptionPriceAmount: {
                    __typename: "Metafield",
                    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTE5NDA5Nzc0NzU2NjI=",
                    value: "29.99",
                  },
                  title: "Default Title",
                },
              },
            ],
          },
        },
      },
    },
  },
];

export const subscriptionSale: MockedResponse[] = [
  {
    request: {
      query: PRODUCT_PAGE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        productPage: {
          __typename: "PProductPage",
          _meta: {
            __typename: "PMeta",
            id: "Xr7m1xAAAAVkyvsH",
            lang: "en-us",
            tags: [],
            type: "product_page",
            uid: "the-one",
          },
          body: [
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "natural_features",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyFeatures",
              fields: [
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "Prevention is the best cure. And your dog deserves the best.",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "Our experts identified the eight areas your bestie is bound to struggle with most. Then they developed a supplement to tackle each and every one of them. Head on. ",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "They’ve got your back. \nNow you can get theirs.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2160,
                      width: 2944,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/edbb2815-9b2c-4fc1-8e1f-5135d47af84d_hammock-bois.jpg?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
              ],
              label: "standard",
              type: "features",
            },
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "benefits",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyPlaceholder",
              primary: {
                __typename: "PProductPageBodyPlaceholderPrimary",
                content: "ingredients_and_details",
              },
              type: "placeholder",
            },
            {
              __typename: "PProductPageBodyTestimonials",
              fields: [
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxPtxEAACQADAR7",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Pepper’s mom",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 1264,
                        width: 1304,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/8d84529e-aff4-44b6-acd0-449eb6efb98b_pepper.png?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "My last dog had so many health conditions. I’m not letting that happen this time around.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxQFREAACQADAVA",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Baxter's dad",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 680,
                        width: 680,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/7dab850c-2c53-443f-8bee-18e226fcbd46_baxter.jpg?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "Baxter’s itchy skin has totally cleared up. I haven’t caught him scratching in weeks.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
                {
                  __typename: "PProductPageBodyTestimonialsFields",
                  testimonial: {
                    __typename: "PTestimonial",
                    _meta: {
                      __typename: "PMeta",
                      id: "XjxQMxEAACQADAV4",
                      lang: "en-us",
                      tags: [],
                      type: "testimonial",
                      uid: null,
                    },
                    attribution: [
                      {
                        spans: [],
                        text: "Nugget's mom",
                        type: "paragraph",
                      },
                    ],
                    image: {
                      alt: null,
                      copyright: null,
                      dimensions: {
                        height: 600,
                        width: 600,
                      },
                      url:
                        "https://images.prismic.io/prod-fotp-frontend/63e97f51-763c-41f1-b5f2-45fdbb0dd2bd_nugget.jpg?auto=compress,format",
                    },
                    quote: [
                      {
                        spans: [],
                        text:
                          "Pugs are predisposed to lots of diseases. It’s great to know that Nugget can get ahead of them now.",
                        type: "paragraph",
                      },
                    ],
                  },
                },
              ],
              primary: {
                __typename: "PProductPageBodyTestimonialsPrimary",
                heading: [
                  {
                    spans: [],
                    text: "Loved by dogs and their humans",
                    type: "paragraph",
                  },
                ],
              },
              type: "testimonials",
            },
            {
              __typename: "PProductPageBodyExpertQuote",
              primary: {
                __typename: "PProductPageBodyExpertQuotePrimary",
                expert: {
                  __typename: "PExpert",
                  _meta: {
                    __typename: "PMeta",
                    id: "XlPmGhEAACUAlEEm",
                    lang: "en-us",
                    tags: [],
                    type: "expert",
                    uid: null,
                  },
                  bio: [
                    {
                      spans: [],
                      text:
                        "Anthony is a nutritional and exercise biochemist with an impressive record of industry and academic accomplishments. During his 45 year career, he has earned 3 patents, collaborated on over 50 clinical trials and pioneered entirely new nutritional supplement categories – creatine and thermogenics among them. Along with chairing Front Of The Pack's Science Advisory Board, Anthony is also the founder and CEO of IMAGINutrition, a nutritional technology think tank focused on clinical research, due diligence, and product innovation.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 1140,
                      width: 1140,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/a37c30af-9a48-4274-ae41-7c4ade99d831_anthony.jpg?auto=compress,format",
                  },
                  name: [
                    {
                      spans: [],
                      text: "Anthony L. Almada",
                      type: "paragraph",
                    },
                  ],
                  postNominal: [
                    {
                      spans: [],
                      text: "MSc, FISSN",
                      type: "paragraph",
                    },
                  ],
                  role: [
                    {
                      spans: [],
                      text: "Biochemist",
                      type: "paragraph",
                    },
                  ],
                },
                heading: [
                  {
                    spans: [
                      {
                        end: 27,
                        start: 14,
                        type: "em",
                      },
                    ],
                    text: "Backed by our world-leading board of experts",
                    type: "paragraph",
                  },
                ],
                quote: [
                  {
                    spans: [],
                    text:
                      "Supplements are an excellent way to provide your dog with additional benefits that go beyond a healthy diet.",
                    type: "paragraph",
                  },
                ],
              },
              type: "expert_quote",
            },
            {
              __typename: "PProductPageBodyFeatures",
              fields: [
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "We’ve developed a savory broth-like flavor that’s proven to appeal to 98% of dogs - even the fussiest. All natural, nothing artificial.",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "Simply sprinkle the recommended number of scoops on your bestie’s food and watch them woof it down.",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Tasty for them.\nSimple for you.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2160,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/1cec46b3-0ae0-45a0-a830-f7d51c263325_tasty.jpg?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: null,
                  callToActionTarget: null,
                  description: [
                    {
                      spans: [],
                      text:
                        "We like to go light on packaging. What little we do use is 100% eco-friendly, from the recyclable tub that holds your dog’s supplement, to the compostable pouch that lines it. ",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Supporting your dog.\nAnd the environment.",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2400,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/84af1e9f-9d02-46d6-86ba-a6f4fe8559fc_fotp-environment.png?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
                {
                  __typename: "PProductPageBodyFeaturesFields",
                  callToAction: [
                    {
                      spans: [],
                      text: "Subscribe now",
                      type: "paragraph",
                    },
                  ],
                  callToActionTarget: "#product-title",
                  description: [
                    {
                      spans: [],
                      text:
                        "Hook your doggo up with a subscription and save on every delivery.    ",
                      type: "paragraph",
                    },
                    {
                      spans: [],
                      text:
                        "And remember - no tight-leash commitments here! You can cancel or change your delivery schedule any time. Free shipping always.",
                      type: "paragraph",
                    },
                  ],
                  heading: [
                    {
                      spans: [],
                      text: "Subscribe & Save",
                      type: "paragraph",
                    },
                  ],
                  image: {
                    alt: null,
                    copyright: null,
                    dimensions: {
                      height: 2400,
                      width: 2948,
                    },
                    url:
                      "https://images.prismic.io/prod-fotp-frontend/48b3de93-b86f-4bef-b44e-ead07656f039_product-subscribe-image.png?auto=compress,format",
                  },
                  imagePlacement: "First",
                },
              ],
              label: "hero",
              type: "features",
            },
            {
              __typename: "PProductPageBodySnippet",
              primary: {
                __typename: "PProductPageBodySnippetPrimary",
                snippet: {
                  __typename: "PSnippet",
                  _meta: {
                    __typename: "PMeta",
                    id: "Xr6ynBAAACgzyg1y",
                    lang: "en-us",
                    tags: [],
                    type: "snippet",
                    uid: "powder-faqs",
                  },
                  body: [
                    {
                      __typename: "PSnippetBodyFaqCategory",
                      fields: [
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnJxEAACIAlEYU",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "results",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "When taken on a regular daily basis, most dogs will begin to show results within around 6 weeks.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "How long will it take to see the results of my dog’s supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XkPL_REAACMALXFA",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "overdose",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements are carefully balanced with your dog’s weight in mind and we always recommend that you stick to the suggested once-daily dose. In the event that your dog accidentally consumes more than the daily recommended dose, consult your vet for advice.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "Is there any risk of my dog overdosing on their supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnjhEAACQAlEf8",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "taste",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements are blended with a nutritious broth-like flavoring proven to be very palatable to dogs. Made from all-natural ingredients and botanicals, this flavoring is allergen-free, contains no artificial nasties and is 100% safe for canine consumption.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Will my dog like the taste?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "Xo3R-xAAACQAJnCd",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "allergen-free",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Yes, along with being gluten-free, pesticide-free and non-GMO, all of our supplements are either allergen-free or hypoallergenic.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Are the supplements allergen-free?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XlPnTREAACMAlEbF",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "safe-for-humans",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Our supplements have been specifically formulated for canine consumption and we do not recommend that humans take it.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Can I eat my dog’s supplement?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "Xo33aRAAAB8AJxzs",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "free-shipping",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "You betcha! Front Of The Pack includes shipping on all products free of charge.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text: "Is shipping free?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                        {
                          __typename: "PSnippetBodyFaqCategoryFields",
                          faq: {
                            __typename: "PFaq",
                            _meta: {
                              __typename: "PMeta",
                              id: "XkLlCREAACIAKWX_",
                              lang: "en-us",
                              tags: [],
                              type: "faq",
                              uid: "cancel",
                            },
                            answer: [
                              {
                                spans: [],
                                text:
                                  "Of course! You are free to cancel your dog’s subscription at any time. This will take place effective immediately and you will not be billed following the date of your cancellation.",
                                type: "paragraph",
                              },
                            ],
                            question: [
                              {
                                spans: [],
                                text:
                                  "Can I cancel my subscription at any time?",
                                type: "paragraph",
                              },
                            ],
                          },
                        },
                      ],
                      primary: {
                        __typename: "PSnippetBodyFaqCategoryPrimary",
                        heading: null,
                      },
                      type: "faq_category",
                    },
                  ],
                },
              },
              type: "snippet",
            },
          ],
          product: pProductFragment,
        },
      },
    },
  },
  {
    request: {
      query: PRODUCT_BY_HANDLE,
      variables: { handle: "handle" },
    },
    result: {
      data: {
        product: {
          ...ecommerce.mockedResponses.product.productCoreMove,
          __typename: "Product",
          availableForSale: true,
          bottomline: {
            __typename: "ReviewBottomline",
            averageScore: 4.5,
            totalReviews: 2,
          },
          bundleUnit: null,
          bundleUnitPlural: null,
          defaultSelectionSku: null,
          defaultSelectionSubscription: null,
          defaultVariantOrder: null,
          description: "Targeted joint and mobility support",
          hasSubscription: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTE5NDA5Nzc4MzYxMTA=",
            value: "True",
          },
          images: {
            __typename: "ImageConnection",
            edges: [
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "1",
                  url: "https://cdn.shopify.com/mock-image/product-1.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "2",
                  url: "https://cdn.shopify.com/mock-image/product-2.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "3",
                  url: "https://cdn.shopify.com/mock-image/product-3.jpg",
                  width: 1000,
                },
              },
              {
                __typename: "ImageEdge",
                node: {
                  __typename: "Image",
                  height: 1000,
                  id: "4",
                  url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
                  width: 1000,
                },
              },
            ],
          },
          isSubscriptionOnly: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTE5NDA5Nzc4MzYxXXX=",
            value: "False",
          },
          listingSku: null,
          listingSubscription: null,
          listingSubtitle: null,
          options: [
            {
              __typename: "ProductOption",
              id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0T3B0aW9uLzU4NzMxNjM4NjIwOTQ=",
              name: "Title",
              values: ["Default Title"],
            },
          ],
          preorderShippingEstimate: null,
          seo: { description: "", title: "" },
          subscriptionFrequencies: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTE5NDA5Nzc4Njg4Nzg=",
            value: "20,30,60",
          },
          subscriptionUnit: {
            __typename: "Metafield",
            id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTIzMDY2MDA1NTg2NzA=",
            value: "Days",
          },
          unit: null,
          variants: {
            __typename: "ProductVariantConnection",
            edges: [
              {
                __typename: "ProductVariantEdge",
                node: {
                  __typename: "ProductVariant",
                  availableForSale: true,
                  barcode: "123",
                  bundleSize: null,
                  compareAtPriceV2: {
                    __typename: "MoneyV2",
                    amount: "39.99",
                    currencyCode: "USD",
                  },
                  defaultShippingIntervalFrequency: {
                    __typename: "Metafield",
                    id: "defaultShippingIntervalFrequency-4",
                    value: "1",
                  },
                  id:
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTc0NjY1MDQwNjk5MA==",
                  image: {
                    __typename: "Image",
                    height: 1000,
                    id: "4",
                    url: "https://cdn.shopify.com/mock-image/variant-4.jpg",
                    width: 1000,
                  },
                  listingUsp: null,
                  priceV2: {
                    __typename: "MoneyV2",
                    amount: "34.99",
                    currencyCode: "USD",
                  },
                  quantityAvailable: 10,
                  selectedOptions: [
                    {
                      __typename: "SelectedOption",
                      name: "Title",
                      value: "Default Title",
                    },
                  ],
                  sku: "move",
                  subscriptionPriceAmount: {
                    __typename: "Metafield",
                    id: "Z2lkOi8vc2hvcGlmeS9NZXRhZmllbGQvMTE5NDA5Nzc0NzU2NjI=",
                    value: "29.99",
                  },
                  title: "Default Title",
                },
              },
            ],
          },
        },
      },
    },
  },
];
