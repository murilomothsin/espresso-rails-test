import FormStatementModal from "../../../../app/javascript/components/statements/FormStatementModal";
import {render, fireEvent, waitFor, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import flushPromises from "flush-promises";
import "@testing-library/jest-dom";


describe("FormStatementModal", () => {
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
    name: "test category",
  }
  it('renders component correctly', () => {
      const component = render(<FormStatementModal statement={statement} categories={[category]} open handleClose={() => true} handleOpen={() => true} />)
      expect(component.getByTestId('form-statement')).toBeInTheDocument()
  })

  it('uploads a single file', async () => {
    const file = new File(['foo'], 'foo.jpeg', { type: 'image/jpeg' });
    render(<FormStatementModal statement={statement} categories={[category]} open handleClose={() => true} handleOpen={() => true} />)
    const input = screen.getByLabelText('Arquivo');
    await userEvent.upload(input, file);

    expect(input.files.length).toBe(1);
   });

   it("should display options", async () => {
    render(<FormStatementModal statement={statement} categories={[category]} open handleClose={() => true} handleOpen={() => true} />)

    const dropdown = within(await screen.findByTestId("category-select")).getByRole("combobox");
    await userEvent.click(dropdown);
    expect(
      await screen.findByRole("option", { name: "test category" }),
    ).toBeInTheDocument();
    // expect(screen.getByRole("option", { name: "Su" })).toBeInTheDocument();
  });

  it("should display selected category", async () => {
    render(<FormStatementModal statement={statement} categories={[category]} open handleClose={() => true} handleOpen={() => true} />)

    const dropdown = within(await screen.findByTestId("category-select")).getByRole("combobox");
    await userEvent.click(dropdown);
    await userEvent.click(await screen.findByRole("option", { name: "test category" }));
    expect(screen.getByText("test category")).toBeInTheDocument();
  });

  it('should call submit and send data', async () => {
    const file = new File(['foo'], 'foo.jpeg', { type: 'image/jpeg' });
    window.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => {},
    }))
    const mockHandleClose = jest.fn();
    render(<FormStatementModal statement={statement} categories={[category]} open handleClose={mockHandleClose} handleOpen={() => true} />)
    const input = screen.getByLabelText('Arquivo');
    await userEvent.upload(input, file);

    const button = screen.getByTestId('submit')
    fireEvent.click(button)
    await flushPromises()
    expect(mockHandleClose.mock.calls).toHaveLength(1);
  })
})