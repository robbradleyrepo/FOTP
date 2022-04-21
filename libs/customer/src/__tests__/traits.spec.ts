import _Cookies from "js-cookie";
import { mocked } from "ts-jest/utils";

import { getTraitsFromCookie, setTraitsCookie } from "../traits";

jest.mock("js-cookie");

const Cookies = mocked(_Cookies, true);

describe("getTraitsFromCookie", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully decode and identify traits cookie", () => {
    // I can't work out how to get jest typing to realise we're mocking
    // `.get(string)` rather than `.get()`...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Cookies.get as any).mockReturnValue(
      btoa(
        JSON.stringify({
          t: {
            email: "user@example.com",
            id: 123,
          },
          v: 1,
        })
      )
    );

    const traits = getTraitsFromCookie({
      domain: "example.com",
      name: "cookie",
    });

    expect(traits).toEqual({
      email: "user@example.com",
      id: 123,
    });

    // We did not remove the cookie
    expect(Cookies.remove).toHaveBeenCalledTimes(0);
  });

  it("should remove traits cookie on malformed JSON payload", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Cookies.get as any).mockReturnValue("{{");

    const traits = getTraitsFromCookie({
      domain: "example.com",
      name: "cookie",
    });

    expect(traits).toBeNull();

    // We removed the cookie
    expect(Cookies.remove).toHaveBeenCalledTimes(1);
  });

  it("should remove traits cookie on failed runtime check", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Cookies.get as any).mockReturnValue(
      btoa(
        JSON.stringify({
          t: {
            email: "user@example.com",
            // missing ID
          },
          v: 1,
        })
      )
    );

    const traits = getTraitsFromCookie({
      domain: "example.com",
      name: "cookie",
    });

    expect(traits).toBeNull();

    // We removed the cookie
    expect(Cookies.remove).toHaveBeenCalledTimes(1);
  });
});

describe("setTraitsFromCookie", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully set traits cookies and strip undefined values", () => {
    setTraitsCookie(
      {
        email: "user@example.com",
        firstName: undefined,
        id: 123,
      },
      {
        domain: "example.com",
        name: "cookie",
      }
    );

    expect(Cookies.set).toHaveBeenCalledWith(
      "te-t-cookie",
      // btoa of: {"t":{"email":"user@example.com","id":123},"v":1}
      "eyJ0Ijp7ImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlkIjoxMjN9LCJ2IjoxfQ==",
      { domain: "example.com", expires: 365, secure: expect.any(Boolean) }
    );
  });
});
