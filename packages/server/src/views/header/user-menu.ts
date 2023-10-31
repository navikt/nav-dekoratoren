import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { BadgeIcon, PersonCircleIcon } from 'decorator-shared/views/icons';
import { LogoutIcon } from 'decorator-shared/views/icons/logout';
import cls from 'decorator-client/src/styles/user-menu.module.css';
import { Notifications, Notification } from '../notifications/notifications';

export type UserMenuProps = {
  texts: Texts;
  name: string;
  notifications: Notification[];
};

export const UserMenu = ({ texts, name, notifications }: UserMenuProps) =>
  html`<div class="${cls.userMenu}">
    <div class="${cls.menuItems}">
      <div class="${cls.menuHeader}">
        <div class="${cls.loggedIn}">${texts.logged_in}</div>
        <div class="${cls.name}">${name}</div>
      </div>
      <a href="#TODO" class="${cls.menuItem}">
        ${PersonCircleIcon({ className: cls.menuItemIcon })}
        <span>Min side</span>
      </a>
      <a href="#TODO" class="${cls.menuItem}">
        ${BadgeIcon({ className: cls.menuItemIcon })}
        <span>Personopplysninger</span>
      </a>
    </div>
    <div class="${cls.notifications}">
      ${Notifications({ texts, notifications })}
    </div>
    <a href="#TODO" class="${cls.menuItem} ${cls.logout}">
      ${LogoutIcon({})}
      <span>Logg ut</span>
    </a>
  </div>`;
