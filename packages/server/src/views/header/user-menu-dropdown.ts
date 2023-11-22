import cls from '@styles/user-menu-dropdown.module.json';
import { LoginLevel } from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';
import {
  PersonCircleIcon,
  PersonCircleNotificationIcon,
} from 'decorator-shared/views/icons';
import { DropdownMenu } from '../dropdown-menu';
import { IconButton } from '../icon-button';
import { Notification } from '../notifications/notifications';
import { UserMenu } from './user-menu';

export type UserMenuDropdownProps = {
  texts: Texts;
  name?: string;
  notifications?: Notification[];
  level: LoginLevel;
  logoutUrl: string;
};

export const UserMenuDropdown = ({
  texts,
  name,
  notifications,
  level,
  logoutUrl,
}: UserMenuDropdownProps) =>
  DropdownMenu({
    button: IconButton({
      text: name ?? '',
      Icon: notifications?.length
        ? PersonCircleNotificationIcon({
            className: cls.icon,
          })
        : PersonCircleIcon({
            className: cls.icon,
          }),
    }),
    dropdownClass: cls.userMenuDropdown,
    dropdownContent: UserMenu({
      texts,
      name,
      notifications,
      level,
      logoutUrl: logoutUrl
    }),
  });
