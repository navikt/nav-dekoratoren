export type Node = {
  children: Node[];
  displayName: string;
  path?: string;
  flatten?: boolean;
  id: string;
  isActive?: boolean;
};

export type Link = {
  content: string;
  url: string;
};

export type LinkGroup = {
  heading?: string;
  children: Link[];
};

export type Texts = {
  share_screen: string;
  to_top: string;
  menu: string;
  close: string;
  did_you_find: string;
  search: string;
  login: string;
  logout: string;
  notifications: string;
  notifications_empty_list: string;
  notifications_empty_list_description: string;
  notifications_show_all: string;
  notifications_messages_title: string;
  notified_EPOST: string;
  notified_SMS: string;
  earlier_notifications: string;
  masked_message_text: string;
  masked_task_text: string;
  archive: string;
  notifications_tasks_title: string;
  token_warning_title: string;
  token_warning_body: string;
  session_warning_title: string;
  session_warning_body: string;
  yes: string;
  ok: string;
};

export type Driftsmelding = {
  heading: string;
  url: string;
  urlscope: string[];
};
