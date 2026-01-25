import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorButton } from './calculator-button';
import { describe, expect, it, vi } from 'vitest';
import { Component, ElementRef, viewChild } from '@angular/core';
@Component({
  selector: 'app-test-button',
  imports: [CalculatorButton],
  template: `
    <app-calculator-button
      ><span class="text-2xl">C</span></app-calculator-button
    >
  `,
})
class TestComponent {
  contentValue = viewChild<ElementRef>('button');
}

describe('CalculatorButton test', () => {
  let component: CalculatorButton;
  let fixture: ComponentFixture<CalculatorButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorButton, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorButton);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply w-1/4 double size is false', () => {
    const hostElement = fixture.nativeElement as HTMLElement;
    const hostCss = hostElement.classList.value;
    expect(hostCss).toContain('w-1/4');
  });

  it('should apply w-2/4 double size is true', () => {
    fixture.componentRef.setInput('isDoubleSize', true);
    fixture.detectChanges();
    const hostElement = fixture.nativeElement as HTMLElement;
    const hostCss = hostElement.classList.value;

    expect(hostCss).toContain('w-2/4');
  });

  it('should apply is-command class when isCommand is true', () => {
    fixture.componentRef.setInput('isCommand', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;

    expect(button.classList).toContain('is-command');
  });

  it('should emit click event when clicked', () => {
    const spy = vi.spyOn(component.buttonClick, 'emit');
    const button = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    button.innerText = '1';
    button?.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should set isPressed to true and then false when keyboard key is pressed', () => {
    component.contentValue()!.nativeElement.innerText = '1';
    component.keyWordPressedStyle('1');
    expect(component.isPressed()).toBe(true);
    setTimeout(() => {
      expect(component.isPressed()).toBe(false);
    }, 101);
  });

  it('should no set isPressed if key does not match', () => {
    component.contentValue()!.nativeElement.innerText = '1';
    component.keyWordPressedStyle('2');
    expect(component.isPressed()).toBe(false);
  });

  it('should project content value', () => {
    const fixtureHost = TestBed.createComponent(TestComponent);
    fixtureHost.detectChanges();
    const compiled = fixtureHost.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-2xl')).toBeTruthy();
    expect(compiled.textContent?.trim()).toContain('C');
  });
});
