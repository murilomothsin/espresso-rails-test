import ListStatements from "../../../../app/javascript/components/statements/ListStatements";
import {render, fireEvent, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";


describe("ListStatements", () => {
  const statement = {
    id: 1,
    merchant: "Uber",
    cost: "2344",
    performed_at: "2024-08-25",
    card: { last4: '1234'},
    has_attachment: false,
    user: { name: 'José' },
    category: { name: 'testCategory' },
    archived: false
  }
  const category = {
    id: 1,
    company_id: 1,
    name: "test company",
  }
  it('renders component correctly', () => {
      const component = render(<ListStatements statements={[statement]} categories={[category]} />)
      expect(component.getByTestId('header-statements')).toBeInTheDocument()
  })

  it('change tabs correctly', async() => {
    const component = render(<ListStatements statements={[statement]} categories={[category]} />)
    const tab = component.getByTestId('archived-tab')
    await userEvent.click(tab);
    await waitFor(() => {
      expect(component.getByTestId('archived-grid')).toBeInTheDocument()
      expect(component.queryByTestId('full-grid')).not.toBeInTheDocument()
    })
  })

  it('open edit modal', async() => {
    const component = render(<ListStatements statements={[statement]} categories={[category]} />)
    const button = component.getByTestId('edit-statement')
    fireEvent.click(button)
    await waitFor(() => {
      expect(component.getByTestId('form-statement')).toBeInTheDocument()
    })
  })

  it("close edit modal and update data", async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => ([{ ...statement, has_attachment: true }]),
    }))
    const component = render(<ListStatements statements={[statement]} categories={[category]} />)
    const button = component.getByTestId('edit-statement')
    await userEvent.click(button);
    expect(component.getByTestId('form-statement')).toBeInTheDocument()
    const submit_btn = component.getByTestId('submit')
    await userEvent.click(submit_btn);
    expect(component.getByTestId('proved-chip')).toBeInTheDocument()
  });
})