import Login from "../../../app/javascript/components/Login";
import {render, fireEvent} from "@testing-library/react";
import flushPromises from "flush-promises";
import "@testing-library/jest-dom";
import "jest-location-mock";

describe("Login", () => {
  it('renders page correctly', () => {
      const component = render(<Login />)
      expect(component.getByText('Logar no Espresso')).toBeInTheDocument()
  })

  it('redirect to user create page', () => {
    const component = render(<Login />)
    const button = component.getByText('Criar conta')
    fireEvent.click(button)
    expect(window.location).toBeAt("/users/new")
  })

  it('fullfil email input', () => {
    const component = render(<Login />)
    const input = component.getByLabelText('E-mail')
    fireEvent.change(input, {target: {value: 'teste@email.com'}})
    expect(input.value).toBe('teste@email.com')
  })

  it('fullfil password input', () => {
    const component = render(<Login />)
    const input = component.getByLabelText('Senha')
    fireEvent.change(input, {target: {value: '123456'}})
    expect(input.value).toBe('123456')
  })

  it('should call submit and send data', async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => {},
    }))
    const component = render(<Login />)
    const button = component.getByText('Entrar')
    fireEvent.click(button)
    await flushPromises()
    expect(window.location).toBeAt("/statements")
  })
})