import ListCategories from "../../../../app/javascript/components/categories/ListCategories";
import {render, fireEvent, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";


describe("ListCategories", () => {
  const user = {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    role: "admin"
  }
  const category = {
    id: 1,
    company_id: 1,
    name: "test company",
  }
  it('renders component correctly', () => {
      const component = render(<ListCategories categories={[category]} />)
      expect(component.getByTestId('header-categories')).toBeInTheDocument()
  })

  it('open edit modal', async() => {
    const component = render(<ListCategories categories={[category]} />)
    const button = component.getByTestId('new-category')
    fireEvent.click(button)
    await waitFor(() => {
      expect(component.getByTestId('form-category-new')).toBeInTheDocument()
    })
  })

  it("close edit modal and update data", async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => ([{id: 1, company_id: 1, name: 'POTS'}]),
    }))
    const component = render(<ListCategories categories={[category]} />)
    const button = component.getByTestId('new-category')
    await userEvent.click(button);
    expect(component.getByTestId('form-category-new')).toBeInTheDocument()
    const submit_btn = component.getByTestId('submit')
    await userEvent.click(submit_btn);
    expect(component.getByText('POTS')).toBeInTheDocument()
  });
})