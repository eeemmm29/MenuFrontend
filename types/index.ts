import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface DetailItem {
  label: string;
  value: string | number | undefined;
}
