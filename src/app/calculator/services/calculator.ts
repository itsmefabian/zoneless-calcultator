import { Injectable, signal, computed } from '@angular/core';

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operators = ['+', '-', '*', '/', 'x', '÷'];
const specialOperators = ['+/-', '%', '.', '=', 'C', 'Backspace'];

@Injectable({
  providedIn: 'root',
})
export class Calculator {
  public resultText = signal<string>('0');
  public subResultText = signal<string>('0');
  public lastOperator = signal<string>('');

  public readonly currentValue = computed(() =>
    Number.parseFloat(this.resultText())
  );
  public readonly previousValue = computed(() =>
    Number.parseFloat(this.subResultText())
  );

  /**
   * Main entry point for handling calculator input
   */
  constructNumber(value: string): void {
    // Validate input
    if (![...numbers, ...operators, ...specialOperators].includes(value)) {
      return;
    }

    // Handle special operations
    if (value === 'C') {
      this.clear();
      return;
    }

    if (value === 'Backspace') {
      this.handleBackspace();
      return;
    }

    if (value === '=') {
      this.calculateResult();
      return;
    }

    if (value === '%') {
      this.handlePercentage();
      return;
    }

    if (value === '+/-') {
      this.toggleSign();
      return;
    }

    if (value === '.') {
      this.handleDecimal();
      return;
    }

    // Handle operators
    if (operators.includes(value)) {
      this.handleOperator(value);
      return;
    }

    // Handle number input
    if (numbers.includes(value)) {
      this.handleNumberInput(value);
    }
  }

  /**
   * Clear all calculator state
   */
  private clear(): void {
    this.resultText.set('0');
    this.subResultText.set('0');
    this.lastOperator.set('');
  }

  /**
   * Remove the last character from the current number
   */
  private handleBackspace(): void {
    const current = this.resultText();

    if (current === '0') {
      return;
    }

    if (
      current.length === 1 ||
      (current.length === 2 && current.startsWith('-'))
    ) {
      this.resultText.set('0');
      return;
    }

    this.resultText.update((text) => text.slice(0, -1));
  }

  /**
   * Handle operator input (+, -, *, /, x, ÷)
   */
  private handleOperator(operator: string): void {
    // Normalize operators
    const normalizedOperator = this.normalizeOperator(operator);

    // If there's a pending operation, calculate it first
    if (this.lastOperator() && this.subResultText() !== '0') {
      this.calculateResult();
    }

    this.lastOperator.set(normalizedOperator);
    this.subResultText.set(this.resultText());
    this.resultText.set('0');
  }

  /**
   * Normalize operator symbols (÷ → /, x → *)
   */
  private normalizeOperator(operator: string): string {
    const operatorMap: Record<string, string> = {
      '÷': '/',
      x: '*',
    };
    return operatorMap[operator] || operator;
  }

  /**
   * Calculate the result based on the current operator
   */
  private calculateResult(): void {
    const operator = this.lastOperator();

    if (!operator) {
      return;
    }

    const num1 = this.previousValue();
    const num2 = this.currentValue();
    let result = 0;

    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        if (num2 === 0) {
          this.resultText.set('Error');
          this.subResultText.set('0');
          this.lastOperator.set('');
          return;
        }
        result = num1 / num2;
        break;
    }

    // Format result to avoid floating point issues and limit decimals
    const formattedResult = this.formatResult(result);

    this.resultText.set(formattedResult);
    this.subResultText.set('0');
    this.lastOperator.set('');
  }

  /**
   * Format the result to handle floating point precision
   */
  private formatResult(value: number): string {
    // Handle very large or very small numbers
    if (Math.abs(value) > 999999999) {
      return value.toExponential(5);
    }

    // Round to 10 decimal places to avoid floating point errors
    const rounded = Math.round(value * 10000000000) / 10000000000;

    // Convert to string and remove trailing zeros
    let result = rounded.toString();

    // Limit total length to 10 characters
    if (result.length > 10) {
      if (result.includes('.')) {
        const parts = result.split('.');
        const integerPart = parts[0];
        const decimalPlaces = Math.max(0, 10 - integerPart.length - 1);
        result = rounded.toFixed(decimalPlaces);
      } else {
        result = rounded.toExponential(3);
      }
    }

    return result;
  }

  /**
   * Handle percentage operation
   */
  private handlePercentage(): void {
    const current = this.currentValue();
    const result = current / 100;
    this.resultText.set(this.formatResult(result));
  }

  /**
   * Toggle the sign of the current number
   */
  private toggleSign(): void {
    const current = this.resultText();

    if (current === '0' || current === 'Error') {
      return;
    }

    if (current.startsWith('-')) {
      this.resultText.set(current.slice(1));
    } else {
      this.resultText.set('-' + current);
    }
  }

  /**
   * Handle decimal point input
   */
  private handleDecimal(): void {
    const current = this.resultText();

    // Don't add decimal if already present
    if (current.includes('.')) {
      return;
    }

    // If empty or zero, set to "0."
    if (current === '0' || current === '' || current === '-0') {
      this.resultText.set(current === '-0' ? '-0.' : '0.');
      return;
    }

    this.resultText.update((text) => text + '.');
  }

  /**
   * Handle number input (0-9)
   */
  private handleNumberInput(num: string): void {
    const current = this.resultText();

    // Prevent input if max length reached
    if (current.length >= 10) {
      return;
    }

    // Don't add leading zeros
    if (current === '0' && num === '0') {
      return;
    }

    // Replace initial zero or error state
    if (current === '0') {
      this.resultText.set(num);
      return;
    }

    // Replace -0 with negative number
    if (current === '-0') {
      this.resultText.set('-' + num);
      return;
    }

    // Reset after error
    if (current === 'Error') {
      this.resultText.set(num);
      return;
    }

    // Append number
    this.resultText.update((text) => text + num);
  }
}
