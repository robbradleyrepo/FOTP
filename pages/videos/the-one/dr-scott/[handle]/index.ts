import VideoDrScottTheOne, {
  getStaticPaths,
  makeVideoStaticPropsGetter,
} from "../../../../../src/pages/video-sales-letters/dr-scott-the-one";

const getStaticProps = makeVideoStaticPropsGetter();

export default VideoDrScottTheOne;

export { getStaticPaths, getStaticProps };
