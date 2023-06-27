import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
//
//   const lintTest = screen.getByRole('button', {
//     name: 'lintTest'
//   })
//   // 틀린 부분, eslint에서 더 좋은 방안 제시
//   // expect(lintTest.textContent).toBe('lintTest')
//   // eslint를 이용해 고친 부분
//   expect(lintTest).toHaveTextContent('lintTest')
// });

test ('the counter starts at 0', () => {
  render(<App />);
  const counterElement = screen.getByTestId("counter");
  expect(counterElement).toHaveTextContent(0);
})

test ('minus button has correct text', () => {
  render(<App />);
  const buttonElement = screen.getByTestId('minus-button');
  expect(buttonElement).toHaveTextContent('-');
})

test ('plus button has correct text', () => {
  render(<App />);
  const buttonElement = screen.getByTestId('plus-button');
  expect(buttonElement).toHaveTextContent('+');
})

test('when the + button is pressed, the counter changes to 1', () => {
  render(<App />);
  const buttonElement = screen.getByTestId('plus-button');
  fireEvent.click(buttonElement);
  const counterElement = screen.getByTestId("counter")
  expect(counterElement).toHaveTextContent(1)
})

test('on/off color as blue color', () => {
  render(<App />);
  const buttonElement = screen.getByTestId('on/off-button');
  expect(buttonElement).toHaveStyle({backgroundColor: "blue"})
})

test("prevent the -, + button from being pressed when the on/off button is clicked", () => {
  render(<App />);
  const onOffButtonElement = screen.getByTestId("on/off-button");
  fireEvent.click(onOffButtonElement);
  const plusButtonElement = screen.getByTestId('plus-button');
  expect(plusButtonElement).toBeDisabled();
})