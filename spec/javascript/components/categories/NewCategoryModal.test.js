import NewCategoryModal from "../../../../app/javascript/components/categories/NewCategoryModal";
import {render, fireEvent, waitFor, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import flushPromises from "flush-promises";
import "@testing-library/jest-dom";


describe("NewCategoryModal", () => {
  it('renders component correctly', () => {
      const component = render(<NewCategoryModal open handleClose={() => true} handleOpen={() => true} />)
      expect(component.getByTestId('form-category-new')).toBeInTheDocument()
  })

  it('fullfil name input', () => {
    const component = render(<NewCategoryModal open handleClose={() => true} handleOpen={() => true} />)
    const input = component.getByLabelText('Nome')
    fireEvent.change(input, {target: {value: 'teste'}})
    expect(input.value).toBe('teste')
  })

  it('should call submit and send data', async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => {},
    }))
    const mockHandleClose = jest.fn();
    render(<NewCategoryModal open handleClose={mockHandleClose} handleOpen={() => true } />);
    const button = screen.getByText('Cadastrar')
    fireEvent.click(button)
    await flushPromises()
    expect(mockHandleClose.mock.calls).toHaveLength(1);
  })
})