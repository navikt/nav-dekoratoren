/**
 * Selectors for important elements on the page
 */
class Id extends String {
  constructor(id: string) {
    super(id);
  }

  // TODO: What if the element is not found?
  get element() {
    return document.getElementById(this.toString()) as HTMLElement;
  }
}

export const selectors = {
  ids: {
    /**
     * Content for the notificatons in the menu dropdown
     */
    VARSLER_MENU_CONTENT: new Id('varsler-menu-content'),
  },
} as const;
