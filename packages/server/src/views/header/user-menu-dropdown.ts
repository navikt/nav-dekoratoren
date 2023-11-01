import html from 'decorator-shared/html';
import { DropdownMenu } from '../dropdown-menu';
import { UserMenu } from './user-menu';
import { Texts } from 'decorator-shared/types';
import { Notification } from '../notifications/notifications';
import cls from 'decorator-client/src/styles/user-menu-dropdown.module.css';
import { IconButton } from '../icon-button';
import { PersonCircleIcon } from 'decorator-shared/views/icons';

export type UserMenuDropdownProps = {
  texts: Texts;
  name?: string;
  notifications?: Notification[];
};

export const UserMenuDropdown = ({
  texts,
  name,
  notifications,
}: UserMenuDropdownProps) =>
  DropdownMenu({
    button: IconButton({
      text: name ?? '',
      Icon: PersonCircleIcon({}),
    }),
    dropdownClass: cls.userMenuDropdown,
    dropdownContent: UserMenu({
      texts,
      name,
      notifications,
    }),
  });
