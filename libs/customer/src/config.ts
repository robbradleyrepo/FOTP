export interface CustomerConfig {
  /**
   * The Cookie used by the Themes Engine site to share user traits
   */
  traitsCookie: {
    name: string;
    domain: string;
  };
}

const CUSTOMER: CustomerConfig = {
  traitsCookie: {
    domain: process.env.ORIGIN?.replace(/^https?:\/\//, "").replace(/:\d+/, ""),
    name: process.env.ENVIRONMENT === "prod" ? "fotp-prod" : "fotp-test",
  },
};

export default CUSTOMER;
