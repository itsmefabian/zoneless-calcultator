import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-calculator-button',
  standalone: true,
  imports: [],
  templateUrl: './calculator-button.html',
  styleUrls: ['./calculator-button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-1/4 border-r border-b border-indigo-400',
    '[class.w-2/4]': 'isDoubleSize()',
  },
})
export class CalculatorButton {
  isCommand = input<boolean, boolean | string>(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  isDoubleSize = input<boolean, boolean | string>(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  buttonClick = output<string>();

  contentValue = viewChild<ElementRef>('button');
  isPressed = signal<boolean>(false);

  handleClick() {
    this.buttonClick.emit(this.contentValue()?.nativeElement.innerText.trim());
    this.contentValue()?.nativeElement.blur();
  }

  keyWordPressedStyle(key: string): void {
    if (!this.contentValue()) {
      return;
    }

    const value = this.contentValue()?.nativeElement.innerText.trim();
    if (value !== key) {
      this.isPressed.set(false);
      return;
    }
    this.isPressed.set(true);
    setTimeout(() => {
      this.isPressed.set(false);
    }, 100);
  }
}
