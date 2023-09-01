import 'jest-preset-angular/setup-jest';
import ResizeObserver from "resize-observer-polyfill";
import 'core-js/stable/structured-clone';

(global as any).ResizeObserver = ResizeObserver;
