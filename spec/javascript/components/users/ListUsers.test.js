import ListUsers from "../../../../app/javascript/components/users/ListUsers";
import {render, fireEvent, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";


describe("ListUsers", () => {
  const user = {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin"
  }

  it('renders component correctly', () => {
      const component = render(<ListUsers users={[user]} />)
      expect(component.getByTestId('header-users')).toBeInTheDocument()
  })

  it('open edit modal', async() => {
    const component = render(<ListUsers users={[user]} />)
    const button = component.getByTestId('edit-user')
    fireEvent.click(button)
    await waitFor(() => {
      expect(component.getByTestId('edit-user-modal')).toBeInTheDocument()
    })
  })

  it("close edit modal and update data", async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => ([{ ...user, name: 'changed' }]),
    }))
    const component = render(<ListUsers users={[user]} />)
    const button = component.getByTestId('edit-user')
    await userEvent.click(button);
    expect(component.getByTestId('edit-user-modal')).toBeInTheDocument()
    const submit_btn = component.getByTestId('submit')
    await userEvent.click(submit_btn);
    await waitFor(() => {
      expect(component.getByText('changed')).toBeInTheDocument()
    })
    
  });
})