import { cleanup, fireEvent } from "@testing-library/react";
import React from "react";

import { anonymous } from "../../../sandbox";
import { Tab, TabList, TabPanel, Tabs } from "../tabs";

const first = {
  content: "This is the first panel's content",
  id: "first",
  label: "This is the first panel's tab label",
};
const second = {
  content: "This is the second panel's content",
  id: "second",
  label: "This is the second panel's tab label",
};
const third = {
  content: "This is the third panel's content",
  id: "third",
  label: "This is the third panel's tab label",
};

const mockData = [first, second, third];

describe("<Tabs />", () => {
  it("should render the tabs and panels with the appropriate IDs", async () => {
    const { component } = await anonymous.component({
      Component: (
        <Tabs initialTabId={first.id}>
          <TabList label="Tabs Test">
            {mockData.map(({ id, label }) => (
              <Tab key={id} id={id}>
                {label}
              </Tab>
            ))}
          </TabList>
          {mockData.map(({ content, id }) => (
            <TabPanel key={id} id={id}>
              {content}
            </TabPanel>
          ))}
        </Tabs>
      ),
    });

    mockData.forEach(({ content, id, label }) => {
      const tab = component.getByText(label).closest("button");
      const tabPanel = component.getByText(content);

      if (!tab) {
        throw new Error("Missing tab");
      }

      expect(tab).toHaveAttribute("id", id);
      expect(tab).toHaveAttribute("aria-controls", `${id}-tab`);
      expect(tabPanel).toHaveAttribute("id", `${id}-tab`);
      expect(tabPanel).toHaveAttribute("aria-labelledby", id);
    });
  });

  it("should display a tab's content when clicked", async () => {
    const { component } = await anonymous.component({
      Component: (
        <Tabs initialTabId={third.id}>
          <TabList label="Tabs Test">
            {mockData.map(({ id, label }) => (
              <Tab key={id} id={id}>
                {label}
              </Tab>
            ))}
          </TabList>
          {mockData.map(({ content, id }) => (
            <TabPanel key={id} id={id}>
              {content}
            </TabPanel>
          ))}
        </Tabs>
      ),
    });

    mockData.forEach(({ content, label }) => {
      const tab = component.getByText(label).closest("button");
      const tabPanel = component.getByText(content);

      if (!tab) {
        throw new Error("Missing tab");
      }

      expect(tab).toHaveAttribute("aria-selected", "false");
      expect(tab).toHaveAttribute("tabindex", "-1");
      expect(tabPanel).toHaveAttribute("hidden", "");

      fireEvent.click(tab);

      expect(tab).toHaveAttribute("aria-selected", "true");
      expect(tab).toHaveAttribute("tabindex", "0");
      expect(tabPanel).not.toHaveAttribute("hidden");
    });
  });

  it("should use `initialTabId` to determine which tab is initially displayed", async () => {
    for (let i = 0; i < mockData.length; i += 1) {
      const current = mockData[i];

      const { component } = await anonymous.component({
        Component: (
          <Tabs initialTabId={current.id}>
            <TabList label="Tabs Test">
              {mockData.map(({ id, label }) => (
                <Tab key={id} id={id}>
                  {label}
                </Tab>
              ))}
            </TabList>
            {mockData.map(({ content, id }) => (
              <TabPanel key={id} id={id}>
                {content}
              </TabPanel>
            ))}
          </Tabs>
        ),
      });

      mockData.forEach(({ content, id, label }) => {
        const isCurrent = id === current.id;

        const tab = component.getByText(label).closest("button");
        const tabPanel = component.getByText(content);

        if (!tab) {
          throw new Error("Missing tab");
        }

        expect(tab).toHaveAttribute("aria-selected", JSON.stringify(isCurrent));
        expect(tab).toHaveAttribute("tabindex", isCurrent ? "0" : "-1");

        isCurrent
          ? expect(tabPanel).not.toHaveAttribute("hidden")
          : expect(tabPanel).toHaveAttribute("hidden", "");
      });

      await cleanup();
    }
  });

  it("should cycle between tabs when the current tab is focused and the user presses the left or right arrow key", async () => {
    const { component } = await anonymous.component({
      Component: (
        <Tabs initialTabId={first.id}>
          <TabList label="Tabs Test">
            {mockData.map(({ id, label }) => (
              <Tab key={id} id={id}>
                {label}
              </Tab>
            ))}
          </TabList>
          {mockData.map(({ content, id }) => (
            <TabPanel key={id} id={id}>
              {content}
            </TabPanel>
          ))}
        </Tabs>
      ),
    });

    const firstTab = component.getByText(first.label).closest("button");
    const secondTab = component.getByText(second.label).closest("button");
    const thirdTab = component.getByText(third.label).closest("button");

    if (!firstTab || !secondTab || !thirdTab) {
      throw new Error("Missing tab(s)");
    }

    // Either left or right arrow should have no effect when prior to focus
    expect(firstTab).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(document, { keyCode: 37 });

    expect(firstTab).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(document, { keyCode: 39 });

    expect(firstTab).toHaveAttribute("aria-selected", "true");

    // Focus the current tab
    fireEvent.focus(firstTab);

    fireEvent.keyDown(document, { keyCode: 37 });

    expect(firstTab).toHaveAttribute("aria-selected", "false");
    expect(thirdTab).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(thirdTab);

    fireEvent.keyDown(document, { keyCode: 37 });

    expect(thirdTab).toHaveAttribute("aria-selected", "false");
    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(secondTab);

    fireEvent.keyDown(document, { keyCode: 37 });

    expect(secondTab).toHaveAttribute("aria-selected", "false");
    expect(firstTab).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(firstTab);

    fireEvent.keyDown(document, { keyCode: 39 });

    expect(firstTab).toHaveAttribute("aria-selected", "false");
    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(secondTab);

    fireEvent.keyDown(document, { keyCode: 39 });

    expect(secondTab).toHaveAttribute("aria-selected", "false");
    expect(thirdTab).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(thirdTab);

    fireEvent.keyDown(document, { keyCode: 39 });

    expect(thirdTab).toHaveAttribute("aria-selected", "false");
    expect(firstTab).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(firstTab);

    fireEvent.blur(firstTab);

    // Either left or right arrow should have no effect when after blur
    expect(firstTab).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(document, { keyCode: 37 });

    expect(firstTab).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(document, { keyCode: 39 });

    expect(firstTab).toHaveAttribute("aria-selected", "true");
  });
});
