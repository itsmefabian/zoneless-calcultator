import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  viewChildren,
} from '@angular/core';
import { CalculatorButton } from '../calculator-button/calculator-button';
import { Calculator } from '@/calculator/services/calculator';

@Component({
  selector: 'calculator',
  standalone: true,
  imports: [CalculatorButton],
  templateUrl: './calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keyup)': 'handleKeyboardEvent($event)',
  },
})
export class CalculatorComponent {
  calculatorButtons = viewChildren(CalculatorButton);
  private readonly calculatorService = inject(Calculator);

  resultText = computed(() => this.calculatorService.resultText());
  subResultText = computed(() => this.calculatorService.subResultText());
  lastOperator = computed(() => this.calculatorService.lastOperator());

  handleClick(value: string) {
    this.calculatorService.constructNumber(value);
  }

  handleKeyboardEvent({ key }: KeyboardEvent) {
    const keyEquivalences: Record<string, string> = {
      Escape: 'C',
      Backspace: 'C',
      Delete: 'C',
      Clear: 'C',
      '*': 'x',
      '/': '/',
      '-': '-',
      '+': '+',
      '=': '=',
      Enter: '=',
    };

    const keyValue = keyEquivalences[key] ?? key;

    this.handleClick(keyValue);
    this.calculatorButtons().forEach((button) => {
      button.keyWordPressedStyle(keyValue);
    });
  }
}
