import '@testing-library/jest-dom';

// Reactをテスト環境用に設定
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// NODE_ENVをtestに設定
process.env.NODE_ENV = 'test';
