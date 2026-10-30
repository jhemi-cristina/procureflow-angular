import {
  Component,
  ElementRef,
  afterNextRender,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Icon } from './icon';

let nextId = 0;

@Component({
  selector: 'app-modal',
  imports: [Icon],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly size = input<'sm' | 'md'>('md');
  readonly closed = output<void>();

  protected readonly titleId = `modal-title-${++nextId}`;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }

  protected onCancel(event: Event) {
    event.preventDefault();
    this.closed.emit();
  }

  protected onClick(event: MouseEvent) {
    if (event.target === event.currentTarget) this.closed.emit();
  }
}
