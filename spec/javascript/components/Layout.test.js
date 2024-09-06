import Layout from "../../../app/javascript/components/Layout";
import {render, fireEvent, waitFor} from "@testing-library/react";
import flushPromises from "flush-promises";
import "@testing-library/jest-dom";
import "jest-location-mock";

describe("Layout", () => {
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin"
  }
  it('renders page correctly', () => {
      const component = render(<Layout user={user} />)
      expect(component.getByTestId('header')).toBeInTheDocument()
  })

  it('renders user name', () => {
    const component = render(<Layout user={user} />)
    expect(component.getByText(user.name)).toBeInTheDocument()
})

  it('redirect to statements', () => {
    const component = render(<Layout user={user} />)
    const button = component.getByTestId('statements')
    fireEvent.click(button)
    expect(window.location).toBeAt("/statements")
  })

  it('redirect to users', () => {
    const component = render(<Layout user={user} />)
    const button = component.getByTestId('users')
    fireEvent.click(button)
    expect(window.location).toBeAt("/users")
  })

  it('redirect to cards', () => {
    const component = render(<Layout user={user} />)
    const button = component.getByTestId('cards')
    fireEvent.click(button)
    expect(window.location).toBeAt("/cards")
  })

  it('redirect to categories', () => {
    const component = render(<Layout user={user} />)
    const button = component.getByTestId('categories')
    fireEvent.click(button)
    expect(window.location).toBeAt("/categories")
  })

  it('logout user', async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => {},
    }))

    const component = render(<Layout user={user} />)
    const button = component.getByTestId('logout')
    fireEvent.click(button)
    await flushPromises()
    expect(window.location).toBeAt("/login")
  })

  it('open menu when admin', async () => {
    const component = render(<Layout user={user} />)
    const button = component.getByTestId('drawer-open')
    fireEvent.click(button)
    await waitFor(() => {
      expect(component.queryByTestId('drawer-open')).toBeNull()
      expect(component.getByTestId('drawer-close')).toBeInTheDocument()
    })
  })

  it('does not open menu when not admin', async () => {
    const component = render(<Layout user={{ ...user, role: 'user' }} />)
    const button = component.getByTestId('drawer-open')
    fireEvent.click(button)
    await waitFor(() => {
      expect(component.getByTestId('drawer-open')).toBeInTheDocument()
    })
  })

  it('close menu', async () => {
    const component = render(<Layout user={user} />)
    const button = component.getByTestId('drawer-open')
    fireEvent.click(button)
    await waitFor(() => {
      const buttonClose = component.getByTestId('drawer-close')
      fireEvent.click(buttonClose)
      expect(component.getByTestId('drawer-open')).toBeInTheDocument()
    })
  })

})