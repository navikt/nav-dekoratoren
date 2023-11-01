import html from '../../html';

export const PersonCircleNotificationIcon = ({
  className,
}: {
  className?: string;
}) =>
  html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    ${className && html`class="${className}"`}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M16.75 5.5C16.75 3.567 18.317 2 20.25 2C22.183 2 23.75 3.567 23.75 5.5C23.75 7.433 22.183 9 20.25 9C18.317 9 16.75 7.433 16.75 5.5Z"
      fill="#FB0505"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M19.8612 10.4851C19.9524 10.9762 20 11.4825 20 12C20 14.611 18.7871 16.9386 16.894 18.4503C16.6897 17.4491 16.1957 16.5211 15.4623 15.7877C14.4777 14.8031 13.1424 14.25 11.75 14.25C10.3576 14.25 9.02225 14.8031 8.03769 15.7877C7.30431 16.5211 6.81031 17.4491 6.60598 18.4503C4.7129 16.9386 3.5 14.611 3.5 12C3.5 7.44365 7.19365 3.75 11.75 3.75C13.0354 3.75 14.2521 4.04397 15.3366 4.56833C15.4318 4.0632 15.603 3.58489 15.8378 3.14574C14.5946 2.5708 13.2098 2.25 11.75 2.25C6.36522 2.25 2 6.61522 2 12C2 17.3848 6.36522 21.75 11.75 21.75C17.1348 21.75 21.5 17.3848 21.5 12C21.5 11.4464 21.4539 10.9036 21.3652 10.3752C21.0066 10.4569 20.6333 10.5 20.25 10.5C20.1192 10.5 19.9895 10.495 19.8612 10.4851ZM14.4016 16.8483C15.0699 17.5166 15.4599 18.4112 15.4971 19.3519C14.3727 19.9261 13.0992 20.25 11.75 20.25C10.4008 20.25 9.12731 19.9261 8.00292 19.3519C8.04007 18.4112 8.43007 17.5166 9.09835 16.8483C9.80161 16.1451 10.7554 15.75 11.75 15.75C12.7446 15.75 13.6984 16.1451 14.4016 16.8483Z"
      fill="#0067C5"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.75 5.75C9.67893 5.75 8 7.42893 8 9.5C8 11.5711 9.67893 13.25 11.75 13.25C13.8211 13.25 15.5 11.5711 15.5 9.5C15.5 7.42893 13.8211 5.75 11.75 5.75ZM9.5 9.5C9.5 8.25736 10.5074 7.25 11.75 7.25C12.9926 7.25 14 8.25736 14 9.5C14 10.7426 12.9926 11.75 11.75 11.75C10.5074 11.75 9.5 10.7426 9.5 9.5Z"
      fill="#0067C5"
    />
  </svg>`;
