import ListStatementsAdmin from "../../../../app/javascript/components/statements/ListStatementsAdmin";
import {render, fireEvent, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";


describe("ListStatementsAdmin", () => {
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
  it('renders component correctly', () => {
      const component = render(<ListStatementsAdmin statements={[statement]} />)
      expect(component.getByTestId('header-statements')).toBeInTheDocument()
  })

  it('change tabs correctly', async() => {
    const component = render(<ListStatementsAdmin statements={[statement]} />)
    const tab = component.getByTestId('archived-tab')
    await userEvent.click(tab);
    await waitFor(() => {
      expect(component.getByTestId('archived-grid')).toBeInTheDocument()
      expect(component.queryByTestId('full-grid')).not.toBeInTheDocument()
    })
  })

  it("archive statement", async () => {
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => ([{ ...statement, archived: true }]),
    }))
    const component = render(<ListStatementsAdmin statements={[statement]} />)
    const button = component.getByTestId('archive')
    await userEvent.click(button);
    await waitFor(() => {
      expect(component.queryByTestId('1')).not.toBeInTheDocument()
    })
  });
})