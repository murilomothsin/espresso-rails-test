import FormUserModal from "../../../../app/javascript/components/users/FormUserModal";
import {render, fireEvent, waitFor, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import flushPromises from "flush-promises";
import "@testing-library/jest-dom";


describe("FormUserModal", () => {
  const user = {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin"
  }
  it('renders component correctly', () => {
      const component = render(<FormUserModal user={[user]} open handleClose={() => true } handleOpen={() => true } />)
      expect(component.getByTestId('edit-user-modal')).toBeInTheDocument()
  })

  it('fullfil name input', () => {
    const component = render(<FormUserModal user={[user]} open handleClose={() => true } handleOpen={() => true } />)
    const input = component.getByLabelText('Nome')
    fireEvent.change(input, {target: {value: 'Mary'}})
    expect(input.value).toBe('Mary')
  })

  it('fullfil email input', () => {
    const component = render(<FormUserModal user={[user]} open handleClose={() => true } handleOpen={() => true } />)
    const input = component.getByLabelText('E-mail')
    fireEvent.change(input, {target: {value: 'mary@email.com'}})
    expect(input.value).toBe('mary@email.com')
  })


  it('should call submit and send data', async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => {},
    }))
    const mockHandleClose = jest.fn();
    render(<FormUserModal user={[user]} open handleClose={mockHandleClose} handleOpen={() => true } />);
    const button = screen.getByText('Cadastrar')
    fireEvent.click(button)
    await flushPromises()
    expect(mockHandleClose.mock.calls).toHaveLength(1);
  })
})