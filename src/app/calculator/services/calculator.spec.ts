import { TestBed } from '@angular/core/testing';
import { Calculator } from './calculator';

describe('CalculatorService', () => {
  let service: Calculator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Calculator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default values', () => {
    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('');
  });

  it('should handle number input', () => {
    service.constructNumber('1');
    expect(service.resultText()).toBe('1');
    service.constructNumber('2');
    expect(service.resultText()).toBe('12');
  });

  it('should handle operators and calculations', () => {
    service.constructNumber('1');
    service.constructNumber('0');
    service.constructNumber('+');
    expect(service.subResultText()).toBe('10');
    expect(service.resultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');

    service.constructNumber('5');
    service.constructNumber('=');
    expect(service.resultText()).toBe('15');
    expect(service.subResultText()).toBe('0');
  });

  it('should handle subtraction', () => {
    service.constructNumber('1');
    service.constructNumber('0');
    service.constructNumber('-');
    service.constructNumber('5');
    service.constructNumber('=');
    expect(service.resultText()).toBe('5');
  });

  it('should handle multiplication', () => {
    service.constructNumber('3');
    service.constructNumber('x');
    service.constructNumber('4');
    service.constructNumber('=');
    expect(service.resultText()).toBe('12');
  });

  it('should handle division', () => {
    service.constructNumber('1');
    service.constructNumber('0');
    service.constructNumber('÷');
    service.constructNumber('2');
    service.constructNumber('=');
    expect(service.resultText()).toBe('5');
  });

  it('should handle division by zero', () => {
    service.constructNumber('1');
    service.constructNumber('÷');
    service.constructNumber('0');
    service.constructNumber('=');
    expect(service.resultText()).toBe('Error');
  });

  it('should clear everything when "C" is pressed', () => {
    service.constructNumber('1');
    service.constructNumber('+');
    service.constructNumber('2');
    service.constructNumber('C');
    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('');
  });

  it('should handle backspace', () => {
    service.constructNumber('1');
    service.constructNumber('2');
    service.constructNumber('Backspace');
    expect(service.resultText()).toBe('1');
    service.constructNumber('Backspace');
    expect(service.resultText()).toBe('0');
  });

  it('should handle negative numbers', () => {
    service.constructNumber('5');
    service.constructNumber('+/-');
    expect(service.resultText()).toBe('-5');
    service.constructNumber('+/-');
    expect(service.resultText()).toBe('5');
  });

  it('should handle percentages', () => {
    service.constructNumber('1');
    service.constructNumber('0');
    service.constructNumber('0');
    service.constructNumber('%');
    expect(service.resultText()).toBe('1');
  });

  it('should handle decimals', () => {
    service.constructNumber('1');
    service.constructNumber('.');
    service.constructNumber('5');
    expect(service.resultText()).toBe('1.5');
    service.constructNumber('.');
    expect(service.resultText()).toBe('1.5');
  });

  it('should handle max length (10 digits)', () => {
    for (let i = 0; i < 11; i++) {
      service.constructNumber('1');
    }
    expect(service.resultText().length).toBe(10);
  });

  it('should correctly handle the user reported bug sequence: 50, +/-, +, 50, =', () => {
    service.constructNumber('5');
    service.constructNumber('0');
    service.constructNumber('+/-');
    expect(service.resultText()).toBe('-50');

    service.constructNumber('+');
    expect(service.subResultText()).toBe('-50');
    expect(service.resultText()).toBe('0');

    service.constructNumber('5');
    service.constructNumber('0');
    service.constructNumber('=');
    expect(service.resultText()).toBe('0');
  });
});
