import menuItemsCls from "decorator-client/src/styles/menu-items.module.css";
import { Button, ButtonProps } from "./button";
import clsx from "clsx";

export const HeaderButton = (props: ButtonProps) =>
    Button({
        ...props,
        className: clsx(props.className, menuItemsCls.menuItem),
    });
