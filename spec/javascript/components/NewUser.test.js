import NewUser from "../../../app/javascript/components/NewUser";
import {render, fireEvent} from "@testing-library/react";
import flushPromises from "flush-promises";
import "@testing-library/jest-dom";
import "jest-location-mock";

describe("NewUser", () => {
  it('renders page correctly', () => {
      const component = render(<NewUser />)
      expect(component.getByTestId('header')).toBeInTheDocument()
  })

  it('fullfil name input', () => {
    const component = render(<NewUser />)
    const input = component.getByLabelText('Nome')
    fireEvent.change(input, {target: {value: 'João'}})
    expect(input.value).toBe('João')
  })

  it('fullfil email input', () => {
    const component = render(<NewUser />)
    const input = component.getByLabelText('E-mail')
    fireEvent.change(input, {target: {value: 'teste@email.com'}})
    expect(input.value).toBe('teste@email.com')
  })

  it('fullfil password input', () => {
    const component = render(<NewUser />)
    const input = component.getByLabelText('Senha')
    fireEvent.change(input, {target: {value: '123456'}})
    expect(input.value).toBe('123456')
  })

  it('fullfil companyName input', () => {
    const component = render(<NewUser />)
    const input = component.getByLabelText('Nome da empresa')
    fireEvent.change(input, {target: {value: 'ACME'}})
    expect(input.value).toBe('ACME')
  })

  it('fullfil cnpj input', () => {
    const component = render(<NewUser />)
    const input = component.getByLabelText('CNPJ')
    fireEvent.change(input, {target: {value: '111111'}})
    expect(input.value).toBe('111111')
  })

  it('should call submit and send data', async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => {},
    }))
    const component = render(<NewUser />)
    const button = component.getByTestId('submit')
    fireEvent.click(button)
    await flushPromises()
    expect(window.location).toBeAt("/login")
  })
})