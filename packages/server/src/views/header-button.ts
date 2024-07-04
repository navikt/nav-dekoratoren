import clsx from "clsx";
import cls from "decorator-client/src/styles/header-button.module.css";
import { Button, ButtonProps } from "./button";

export const HeaderButton = (props: ButtonProps) =>
    Button({
        ...props,
        className: clsx(props.className, cls.headerButton),
    });
