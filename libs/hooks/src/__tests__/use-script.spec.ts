import { act, renderHook } from "@testing-library/react-hooks";

import useScript, { useLazyScript } from "../use-script";

describe("useScript", () => {
  beforeEach(() => {
    const html = document.querySelector("html");
    if (html) {
      html.innerHTML = "";
    }
  });

  it("should append a script tag", () => {
    expect(document.querySelectorAll("script").length).toBe(0);

    const { result } = renderHook(() =>
      useScript({ src: "http://scriptsrc/" })
    );

    const { error } = result.current;

    expect(error).toBeNull();

    const script = document.querySelector("script");
    expect(script).not.toBeNull();
    if (script) {
      expect(script.getAttribute("src")).toEqual("http://scriptsrc/");
    }
  });

  it("should render a script only once", () => {
    expect(document.querySelectorAll("script").length).toBe(0);

    const props = { src: "http://scriptsrc/" };
    const handle = renderHook((p) => useScript(p), {
      initialProps: props,
    });
    expect(document.querySelectorAll("script").length).toBe(1);

    handle.rerender();
    expect(document.querySelectorAll("script").length).toBe(1);
  });

  it("should not cause issues on unmount", async () => {
    const props = { src: "http://scriptsrc/" };
    const handle = renderHook((p) => useScript(p), {
      initialProps: props,
    });

    handle.unmount();

    act(() => {
      const el = document.querySelector("script");
      if (el) {
        el.dispatchEvent(new Event("load"));
      }
    });
  });

  it("should check for script existing on the page before rendering when checkForExisting is true", () => {
    expect(document.querySelectorAll("script").length).toBe(0);

    const previousScript = document.createElement("script");
    previousScript.src = "http://scriptsrc/";
    document.body.appendChild(previousScript);

    expect(document.querySelectorAll("script").length).toBe(1);

    const props = { checkForExisting: true, src: "http://scriptsrc/" };
    const handle = renderHook((p) => useScript(p), {
      initialProps: props,
    });
    expect(document.querySelectorAll("script").length).toBe(1);

    handle.rerender();
    expect(document.querySelectorAll("script").length).toBe(1);
  });

  it("should not check for script existing on the page before rendering when checkForExisting is not set", () => {
    expect(document.querySelectorAll("script").length).toBe(0);

    const previousScript = document.createElement("script");
    previousScript.src = "http://scriptsrc/";
    document.body.appendChild(previousScript);

    expect(document.querySelectorAll("script").length).toBe(1);

    const props = { src: "http://scriptsrc/" };
    const handle = renderHook((p) => useScript(p), {
      initialProps: props,
    });
    expect(document.querySelectorAll("script").length).toBe(2);

    handle.rerender();
    expect(document.querySelectorAll("script").length).toBe(2);
  });

  it("should not load the script if `enabled` is `false`", () => {
    const props = { enabled: false, src: "http://scriptsrc/" };

    expect(document.querySelectorAll("script").length).toBe(0);

    const renderHookResult = renderHook((props) => useScript(props), {
      initialProps: props,
    });

    const { error } = renderHookResult.result.current;

    expect(error).toBeNull();

    let script = document.querySelector("script");
    expect(script).toBeNull();

    renderHookResult.rerender({ ...props, enabled: true });

    script = document.querySelector("script");
    expect(script).not.toBeNull();
    if (script) {
      expect(script.getAttribute("src")).toEqual("http://scriptsrc/");
    }
  });
});

describe("useLazyScript", () => {
  beforeEach(() => {
    const html = document.querySelector("html");
    if (html) {
      html.innerHTML = "";
    }
  });

  it("should append a script tag on load()", () => {
    expect(document.querySelectorAll("script").length).toBe(0);

    const { result } = renderHook(() =>
      useLazyScript({ src: "http://scriptsrc/" })
    );

    expect(result.current[1]).toEqual({
      error: null,
      loaded: false,
    });

    expect(document.querySelector("script")).toBeNull();

    act(() => {
      const load = result.current[0];
      load();
    });

    expect(result.current[1]).toEqual({
      error: null,
      loaded: false,
    });

    const script = document.querySelector("script");
    expect(script).not.toBeNull();
    if (script) {
      expect(script.getAttribute("src")).toEqual("http://scriptsrc/");
    }

    act(() => {
      const el = document.querySelector("script");
      if (el) {
        el.dispatchEvent(new Event("load"));
      }
    });

    expect(result.current[1]).toEqual({
      error: null,
      loaded: true,
    });
  });

  it("should append a script tag on load() only once", () => {
    expect(document.querySelectorAll("script").length).toBe(0);

    const { result } = renderHook(() =>
      useLazyScript({ src: "http://scriptsrc/" })
    );

    expect(result.current[1]).toEqual({
      error: null,
      loaded: false,
    });

    act(() => {
      const load = result.current[0];
      load();
      load();
      load();
    });

    expect(result.current[1]).toEqual({
      error: null,
      loaded: false,
    });

    const scripts = document.querySelectorAll("script");
    expect(scripts.length).toEqual(1);
    const script = scripts[0];
    expect(script).not.toBeNull();
    if (script) {
      expect(script.getAttribute("src")).toEqual("http://scriptsrc/");
    }
  });
});
