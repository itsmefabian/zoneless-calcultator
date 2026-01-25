import { signal } from '@angular/core';
import { CalculatorComponent } from './calculator.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Calculator } from '@/calculator/services/calculator';
import { By } from '@angular/platform-browser';
import { CalculatorButton } from '../calculator-button/calculator-button';

class MockCalculatorService {
  resultText = signal('100');
  subResultText = signal('20');
  lastOperator = signal('-');
  constructNumber = vi.fn();
}

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;
  let mockCalculatorService: MockCalculatorService;

  beforeEach(() => {
    mockCalculatorService = new MockCalculatorService();

    TestBed.configureTestingModule({
      imports: [CalculatorComponent],
      providers: [{ provide: Calculator, useValue: mockCalculatorService }],
    });
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values from service', () => {
    expect(component.resultText()).toBe('100');
    expect(component.subResultText()).toBe('20');
    expect(component.lastOperator()).toBe('-');
  });

  it('should display values in template', () => {
    expect(fixture.nativeElement.textContent).toContain('100');
    expect(fixture.nativeElement.textContent).toContain('20');
    expect(fixture.nativeElement.textContent).toContain('-');
  });

  it('should call constructNumber when a number button is clicked', () => {
    component.handleClick('5');
    expect(mockCalculatorService.constructNumber).toHaveBeenCalled();
    expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('5');
  });

  it('should handle keyboard events correctly', () => {
    const event = new KeyboardEvent('keyup', { key: '5' });
    document.dispatchEvent(event);
    expect(mockCalculatorService.constructNumber).toHaveBeenCalled();
    expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('5');
  });

  it('should handle special keyboards events (Enter , Backspace, Escape)', () => {
    const enterEvent = new KeyboardEvent('keyup', { key: 'Enter' });
    const escapeEvent = new KeyboardEvent('keyup', { key: 'Escape' });
    const backspaceEvent = new KeyboardEvent('keyup', { key: 'Backspace' });
    document.dispatchEvent(enterEvent);
    document.dispatchEvent(escapeEvent);
    document.dispatchEvent(backspaceEvent);
    expect(mockCalculatorService.constructNumber).toHaveBeenCalled();
    expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('=');
    expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('C');
    expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('C');
  });

  it('should call constructNumber when button is clicked', () => {
    const buttons = fixture.debugElement.queryAll(
      By.directive(CalculatorButton),
    );
    buttons[0].triggerEventHandler('buttonClick', 'C');
    expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('C');
  });

  it('should update resultText signal when service updates', () => {
    mockCalculatorService.resultText.set('200');
    fixture.detectChanges();
    expect(component.resultText()).toBe('200');
  });

  it('should have 19 calculator-button components with content projected', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-calculator-button').length).toBe(19);
  });
});
