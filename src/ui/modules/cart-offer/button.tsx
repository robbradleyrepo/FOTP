import {
  ButtonProps as BaseButtonProps,
  contrastButton,
  primaryButton,
} from "../../base/button";
import { CartOfferType } from "./layout";

interface ButtonProps extends BaseButtonProps {
  type?: CartOfferType;
}

const button = ({ type, ...rest }: ButtonProps) =>
  type === CartOfferType.SALES ? contrastButton(rest) : primaryButton(rest);

export default button;
