import { AbstractComponent, type TComponentConfig } from '@course/utils'
import css from './dialog.module.css'
import styles from '@course/styles'
import cx from '@course/cx'

export type TDialogProps = {
  content: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Expected input:
 * {
 *   "content": "<h2>Confirm Action</h2><p>Are you sure?</p>",
 *   "onConfirm": () => void,
 *   "onCancel": () => void
 * }
 *
 * Step 1: Extend AbstractComponent<TDialogProps>
 * - Call super() with config, adding listeners: ['click', 'close']
 * - Store a private reference for the <dialog> element (#dialogElement)
 */

export class Dialog extends AbstractComponent<TDialogProps> {
  #dialogElement: HTMLDialogElement | null = null

  constructor(config: TComponentConfig<TDialogProps>) {
    super({
      ...config,
      listeners: ['click', 'close'],
    })
  }

  toHTML(): string {
    const { content } = this.config
    return `
      <dialog class="${cx(styles.padding24, styles.bNone, styles.br8, css.container)}">
        <section class="${styles.paddingVer8}">
          ${content}
        </section>
        <footer class="${cx(styles.flexRowBetween, styles.flexGap8, styles.paddingVer8)}">
          <button data-action="confirm" autofocus>Confirm</button>
          <button data-action="cancel">Cancel</button>
        </footer>
      </dialog>
    `
  }

  afterRender(): void {
    this.#dialogElement = this.container!.querySelector('dialog')
  }

  // Sync state when dialog is closed natively (e.g., Escape key)
  onClose(): void {
    this.config.onCancel()
  }

  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    const action = target.dataset.action

    if (action === 'confirm') {
      this.config.onConfirm()
      this.close()
    } else if (action === 'cancel') {
      this.config.onCancel()
      this.close()
    }
  }

  open(): void {
    this.#dialogElement?.showModal()
  }

  close(): void {
    this.#dialogElement?.close()
  }
}
