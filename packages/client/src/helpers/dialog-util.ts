export const isDialogDefined = (dialog: HTMLDialogElement) => {
    return dialog?.constructor?.name === "HTMLDialogElement";
};
