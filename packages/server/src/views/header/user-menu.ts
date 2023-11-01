import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import {
  PadlockIcon,
  BadgeIcon,
  PersonCircleIcon,
} from 'decorator-shared/views/icons';
import { LogoutIcon } from 'decorator-shared/views/icons/logout';
import cls from 'decorator-client/src/styles/user-menu.module.css';
import { Notifications, Notification } from '../notifications/notifications';
import { LoginLevel } from 'decorator-shared/params';
import { Alert } from '../alert';

export type UserMenuProps = {
  texts: Texts;
  name?: string;
  notifications?: Notification[];
  level: LoginLevel;
};

export const UserMenu = ({
  texts,
  name,
  level,
  notifications,
}: UserMenuProps) =>
  html`<div class="${cls.userMenu}">
    <div class="${cls.menuItems}">
      <div class="${cls.menuHeader}">
        <div class="${cls.loggedIn}">${texts.logged_in}</div>
        <div class="${cls.name}">${name}</div>
        ${level !== 'Level4' &&
        Alert({
          className: cls.alert,
          variant: 'info',
          content: html`
            <div>
              Du har logget inn med Min ID. Hvis du logger inn med et høyere
              sikkerhetsnivå, får du se mer innhold og flere tjenester.
              <a href="#TODO">Logg inn med BankID, Buypass, eller Commfides</a>
            </div>
          `,
        })}
      </div>
      <a href="#TODO" class="${cls.menuItem}">
        ${PersonCircleIcon({ className: cls.menuItemIcon })}
        <span>Min side</span>
      </a>
      <a href="#TODO" class="${cls.menuItem}">
        ${level === 'Level4'
          ? BadgeIcon({ className: cls.menuItemIcon })
          : PadlockIcon({ className: cls.menuItemIcon })}
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
