import React from "react";

import { Tab, TabList, TabPanel, Tabs } from ".";

export default {
  title: "Components/Tabs",
};

export const StandardTabs = () => (
  <Tabs initialTabId="foo">
    <TabList label="Test Tabs">
      <Tab id="foo">Foo</Tab>
      <Tab id="bar">Bar</Tab>
      <Tab id="baz">Baz</Tab>
    </TabList>
    <TabPanel id="foo">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec scelerisque
      ac nisl faucibus finibus. Suspendisse sit amet pharetra justo. Aliquam
      porta pretium consectetur. Sed sed leo elit. Etiam ex diam, luctus in
      pellentesque eget, suscipit in enim. Ut scelerisque nisi non quam tempor
      tempus. Praesent eget varius risus. Nullam id sapien scelerisque, tempor
      massa imperdiet, scelerisque dolor. Nam sed consectetur velit. Nullam non
      dolor ut risus molestie convallis sit amet ac ligula. Curabitur viverra
      lorem ligula, dapibus varius est dapibus et. Donec diam leo, fringilla id
      massa sit amet, laoreet tempus enim.
    </TabPanel>
    <TabPanel id="bar">
      Aliquam feugiat nec purus ut venenatis. Aenean quis tellus vitae sem
      finibus vehicula. Vivamus vitae tellus sit amet diam vestibulum iaculis eu
      eget neque. Phasellus suscipit nibh lacus, ut laoreet ipsum lobortis quis.
      Sed dolor nisi, commodo a ipsum sit amet, lobortis ultrices nulla. Class
      aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
      himenaeos. Aenean non vulputate justo. Vestibulum placerat lobortis sem,
      in aliquam mi vulputate sit amet. Maecenas bibendum neque eget risus
      lacinia aliquam. Proin rhoncus, mi pulvinar feugiat porttitor, risus ex
      porttitor nunc, vitae sodales augue ipsum ut libero. Vestibulum tempor
      nibh a eros vestibulum blandit. Mauris nulla urna, lobortis vitae egestas
      et, posuere id mauris. Sed orci felis, maximus at orci sed, vulputate
      varius quam.
    </TabPanel>
    <TabPanel id="baz">
      Ut a rhoncus nulla. Morbi a mollis sem, nec lobortis lectus. Sed eleifend
      in erat eget ornare. Nam vehicula euismod erat. Proin iaculis tellus
      feugiat risus sodales, non hendrerit ex iaculis. Aenean non laoreet nisl.
      Nam commodo iaculis pretium. Morbi lorem neque, tempor elementum pretium
      eu, posuere vitae justo. Praesent tincidunt, lacus ut sagittis iaculis,
      est nisl sagittis magna, eget rutrum turpis nisl at quam.
    </TabPanel>
  </Tabs>
);
