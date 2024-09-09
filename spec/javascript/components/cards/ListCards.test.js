import ListCards from "../../../../app/javascript/components/cards/ListCards";
import {render, fireEvent, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";


describe("ListCards", () => {
  const user = {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin"
  }
  const card = {
    id: 1,
    user_id: 1,
    last4: "1234",
  }
  it('renders component correctly', () => {
      const component = render(<ListCards cards={[card]} users={[user]} />)
      expect(component.getByTestId('header-cards')).toBeInTheDocument()
  })

  it('open edit modal', async() => {
    const component = render(<ListCards cards={[card]} users={[user]} />)
    const button = component.getByTestId('edit-card')
    fireEvent.click(button)
    await waitFor(() => {
      expect(component.getByTestId('form-card-edit')).toBeInTheDocument()
    })
  })

  it("close edit modal and update data", async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => ({
        cards: [{id: 1, user_id: 1, last4: '4444'}],
        users: [{id: 1, name: 'John Doe', email: 'johndoe@example.com', role: 'admin'}],
      }),
    }))
    const component = render(<ListCards cards={[card]} users={[user]} />)
    const button = component.getByTestId('edit-card')
    await userEvent.click(button);
    expect(component.getByTestId('form-card-edit')).toBeInTheDocument()
    const submit_btn = component.getByTestId('submit')
    await userEvent.click(submit_btn);
    expect(component.getByTestId('4444')).toBeInTheDocument()
  });
})