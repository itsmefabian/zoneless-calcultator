import { ComponentFixture, TestBed } from '@angular/core/testing';
import CalculatorViewComponent from './calculator-view.component';
import { Component } from '@angular/core';

@Component({
  selector: 'calculator',
  template: `<div>MockCalculator</div>`,
})
class MockCalculator {}

describe('CalculatorViewComponent', () => {
  let component: CalculatorViewComponent;
  let fixture: ComponentFixture<CalculatorViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalculatorViewComponent],
    }).overrideComponent(CalculatorViewComponent, {
      set: {
        imports: [MockCalculator],
      },
    });
    fixture = TestBed.createComponent(CalculatorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the calculator view', () => {
    const compile = fixture.nativeElement as HTMLElement;
    expect(compile.querySelector('calculator')).toBeTruthy();
  });

  it('should render the calculator view', () => {
    const compile = fixture.nativeElement as HTMLElement;
    const divElement = compile.querySelector('div');
    const expectedClasses =
      'min-w-screen min-h-screen bg-slate-600 flex items-center justify-center px-5 py-5'.split(
        ' '
      );
    expectedClasses.forEach((className) => {
      expect(divElement?.classList).toContain(className);
    });
  });
});
